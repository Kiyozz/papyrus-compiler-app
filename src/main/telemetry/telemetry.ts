/*
 * 2022-2026 Kiyozz.
 */

import is from '@sindresorhus/is'
import fetch, { Headers } from 'electron-fetch'
import type { Response } from 'electron-fetch'
import Queue from 'queue'
import { TelemetryEvent } from '#common/telemetry-event.ts'
import type { TelemetryEventProperties } from '#common/telemetry-event.ts'
import { Logger } from '../logger.ts'
import { SettingsStore } from '#main/store/settings/store.ts'
import { Env } from '#main/env.ts'
import { inject } from '#main/inject.ts'

interface Params<E extends TelemetryEvent> {
  name: E
  properties: TelemetryEventProperties[E]
}

@inject()
export class Telemetry {
  readonly #api: string
  readonly #appKey: string
  readonly #logger: Logger
  readonly #telemetryQueue = new Queue({
    concurrency: 3,
    autostart: true,
  })
  #isActive: boolean
  #isOnline = true

  constructor(settingsStore: SettingsStore, env: Env) {
    this.#isActive = settingsStore.get('telemetry.active')
    this.#api = env.telemetryApi
    this.#appKey = env.telemetryApiKey
    this.#logger = new Logger('Telemetry')

    if (
      !env.telemetryEnabled ||
      !is.string(this.#api) ||
      !is.string(this.#appKey) ||
      is.emptyString(this.#api) ||
      is.emptyString(this.#appKey)
    ) {
      this.#logger.debug('no configuration provided. Telemetry is disabled.')
      this.#isActive = false
    }
  }

  event<E extends TelemetryEvent>({
    name,
    properties,
  }: Params<E>): Promise<void> {
    return this.sendRequest(
      { endpoint: '/events', method: 'POST' },
      { type: name, properties, appKey: this.#appKey },
    )
  }

  exception({
    properties,
  }: {
    properties: TelemetryEventProperties[TelemetryEvent.exception]
  }): Promise<void> {
    return this.sendRequest(
      { endpoint: '/events', method: 'POST' },
      { type: TelemetryEvent.exception, properties, appKey: this.#appKey },
    )
  }

  set online(online: boolean) {
    this.#isOnline = online
  }

  set active(active: boolean) {
    this.#isActive = active
  }

  private async sendRequest(
    { endpoint, method }: { endpoint: string; method: 'POST' | 'PUT' },
    payload: Record<string | 'appKey', unknown>,
  ): Promise<void> {
    if (!this.#isActive || !this.#isOnline) {
      if (!this.#isOnline) {
        this.#logger.info('telemetry is disabled: no internet connection')
      }

      if (!this.#isActive) {
        this.#logger.info('telemetry is disabled: not sent')
      }

      return
    }

    const { appKey, ...payloadWithoutAppKey } = payload

    return new Promise((resolve, reject) => {
      this.#telemetryQueue.push(async () => {
        try {
          this.#logger.debug('send telemetry data', payloadWithoutAppKey)
          const response = await fetch(`${this.#api}${endpoint}`, {
            method,
            body: JSON.stringify(payload),
            headers: Telemetry._getHeaders(),
          })

          if (!response.ok) {
            this.#logger.debug(
              "can't send telemetry data",
              await Telemetry._getData(response),
            )
          }

          resolve()
        } catch (error) {
          this.#logger.debug(
            "can't send telemetry data",
            error instanceof Error ? error.message : error,
          )
          this.#logger.info(
            'disabling telemetry for this session because api is either unreachable or an error has occurred',
          )
          this.#isActive = false

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
