/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { PartialDeep } from 'type-fest'

import { TelemetryEvents, TelemetryEventsProperties } from '../telemetry-events'
import { BadError } from './bad-error'
import { CompilationResult } from './compilation-result'
import { Config } from './config'
import { DialogType } from './dialog'

export interface Bridge {
  telemetry: {
    send: <T extends TelemetryEvents>(
      event: T,
      args: TelemetryEventsProperties[T],
    ) => void
    active: (active: boolean) => void
  }

  version: {
    get: () => Promise<string>
  }

  changelog: {
    on: (fn: (args: unknown) => unknown) => void
    off: (fn: (args: unknown) => unknown) => void
  }

  error: (error: Error) => void

  online: (online: boolean) => void

  installation: {
    check: () => Promise<BadError>
  }

  clipboard: {
    copy: (text: string) => Promise<void>
  }

  config: {
    update: (
      partialConfig: PartialDeep<Config>,
      override?: boolean,
    ) => Promise<Config>
    get: () => Promise<Config>
  }

  isProduction: () => Promise<boolean>

  compilation: {
    start: (script: string) => void
    onceFinish: (
      script: string,
      listener: (result: CompilationResult) => void,
    ) => void
  }

  dialog: {
    select: (type: DialogType) => Promise<string | null>
  }

  shell: {
    openExternal: (href: string) => void
  }
}
