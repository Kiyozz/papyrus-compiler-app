/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import fetch, { Response, Headers } from 'electron-fetch'

import {
  TelemetryEvents,
  TelemetryEventsProperties
} from '../../common/telemetry-events'
import { Logger } from '../logger'

interface Params<E extends TelemetryEvents> {
  name: E
  properties: TelemetryEventsProperties[E]
}

export class Telemetry {
  private logger: Logger

  constructor(
    private isActive: boolean,
    private api: string,
    private appKey: string,
    private isOnline: boolean
  ) {
    this.logger = new Logger('Telemetry')

    if (
      !is.string(api) ||
      !is.string(appKey) ||
      is.emptyString(api) ||
      is.emptyString(appKey)
    ) {
      this.logger.debug('no configuration provided. Disabling telemetry.')
      this.isActive = false
    }
  }

  event<E extends TelemetryEvents>({
    name,
    properties
  }: Params<E>): Promise<void> {
    return this.sendRequest(
      { endpoint: '/events', method: 'POST' },
      { type: name, properties, appKey: this.appKey }
    )
  }

  exception({
    properties
  }: {
    properties: TelemetryEventsProperties[TelemetryEvents.Exception]
  }): Promise<void> {
    return this.sendRequest(
      { endpoint: '/events', method: 'POST' },
      { type: TelemetryEvents.Exception, properties, appKey: this.appKey }
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
    payload: Record<string | 'appKey', unknown>
  ): Promise<void> {
    if (!this.isActive || !this.isOnline) {
      if (!this.isOnline) {
        this.logger.info('telemetry is disabled: no internet connection')
      }

      if (!this.isActive) {
        this.logger.info('telemetry is disabled: not sent')
      }

      return
    }

    const { appKey, ...payloadWithAppKey } = payload

    try {
      this.logger.debug('send telemetry data', payloadWithAppKey)
      const response = await fetch(`${this.api}${endpoint}`, {
        method,
        body: JSON.stringify(payload),
        headers: this.getHeaders()
      })

      if (!response.ok) {
        this.logger.debug(
          "can't send telemetry data",
          await this.getData(response)
        )
        return
      }
    } catch (error) {
      this.logger.debug(
        "can't send telemetry data",
        error instanceof Error ? error.message : error
      )
    }
  }

  private getHeaders(): Headers {
    return new Headers([['Content-Type', 'application/json;charset=UTF-8']])
  }

  private getData(response: Response): Promise<string | unknown> {
    return response.headers.get('Content-Type')?.includes('json')
      ? response.json()
      : response.text()
  }
}
