/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import fetch, { Headers } from 'electron-fetch'
import createQueue from 'queue'
import { TelemetryEvent } from '../../common/telemetry-event'
import { Logger } from '../logger'
import type { TelemetryEventProperties } from '../../common/telemetry-event'
import type { Response } from 'electron-fetch'

interface Params<E extends TelemetryEvent> {
  name: E
  properties: TelemetryEventProperties[E]
}

export class Telemetry {
  private readonly _logger: Logger
  private readonly _telemetryQueue = createQueue({
    concurrency: 3,
    autostart: true,
  })

  constructor(
    private isActive: boolean,
    private api: string,
    private appKey: string,
    private isOnline: boolean,
  ) {
    this._logger = new Logger('Telemetry')

    if (
      !is.string(api) ||
      !is.string(appKey) ||
      is.emptyString(api) ||
      is.emptyString(appKey)
    ) {
      this._logger.debug('no configuration provided. Telemetry is disabled.')
      this.isActive = false
    }
  }

  event<E extends TelemetryEvent>({
    name,
    properties,
  }: Params<E>): Promise<void> {
    return this.sendRequest(
      { endpoint: '/events', method: 'POST' },
      { type: name, properties, appKey: this.appKey },
    )
  }

  exception({
    properties,
  }: {
    properties: TelemetryEventProperties[TelemetryEvent.exception]
  }): Promise<void> {
    return this.sendRequest(
      { endpoint: '/events', method: 'POST' },
      { type: TelemetryEvent.exception, properties, appKey: this.appKey },
    )
  }

  setOnline(online: boolean): void {
    this.isOnline = online
  }

  setActive(active: boolean): void {
    this.isActive = active
  }

  private async sendRequest(
    { endpoint, method }: { endpoint: string; method: 'POST' | 'PUT' },
    payload: Record<string | 'appKey', unknown>,
  ): Promise<void> {
    if (!this.isActive || !this.isOnline) {
      if (!this.isOnline) {
        this._logger.info('telemetry is disabled: no internet connection')
      }

      if (!this.isActive) {
        this._logger.info('telemetry is disabled: not sent')
      }

      return
    }

    const { appKey, ...payloadWithoutAppKey } = payload

    return new Promise((resolve, reject) => {
      this._telemetryQueue.push(async () => {
        try {
          this._logger.debug('send telemetry data', payloadWithoutAppKey)
          const response = await fetch(`${this.api}${endpoint}`, {
            method,
            body: JSON.stringify(payload),
            headers: Telemetry._getHeaders(),
          })

          if (!response.ok) {
            this._logger.debug(
              "can't send telemetry data",
              await Telemetry._getData(response),
            )
          }

          resolve()
        } catch (error) {
          this._logger.debug(
            "can't send telemetry data",
            error instanceof Error ? error.message : error,
          )
          this._logger.info(
            'disabling telemetry for this session because api is either unreachable or an error has occurred',
          )
          this.setActive(false)

          reject(error)
        }
      })
    })
  }

  private static _getHeaders(): Headers {
    return new Headers([['Content-Type', 'application/json;charset=UTF-8']])
  }

  private static _getData(response: Response): Promise<string | unknown> {
    return response.headers.get('Content-Type')?.includes('json')
      ? response.json()
      : response.text()
  }
}
