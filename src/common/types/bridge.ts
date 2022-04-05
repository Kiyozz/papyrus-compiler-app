/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import type { PartialDeep } from 'type-fest'
import type {
  TelemetryEvent,
  TelemetryEventProperties,
} from '../telemetry-event'
import type { BadError } from './bad-error'
import type { CompilationResult } from './compilation-result'
import type { Config } from './config'
import type { DialogType } from './dialog'
import type { Disposable } from './disposable'
import type { Platform } from './platform'
import type { Script } from './script'
import type { WindowState } from './window-state'

export interface Bridge {
  telemetry: {
    send: <T extends TelemetryEvent>(
      event: T,
      args: TelemetryEventProperties[T],
    ) => Promise<void>
    setActive: (active: boolean) => Promise<void>
  }

  getVersion: () => Promise<string>

  changelog: {
    on: (fn: (args: unknown) => unknown) => void
    off: (fn: (args: unknown) => unknown) => void
  }

  error: (error: Error) => Promise<void>

  online: (online: boolean) => void

  clipboard: {
    copy: (text: string) => Promise<void>
  }

  config: {
    update: (
      partialConfig: PartialDeep<Config>,
      override?: boolean,
    ) => Promise<Config>
    get: () => Promise<Config>
    onReset: (cb: () => void) => Disposable
    check: (checkMo2: boolean) => Promise<BadError>
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
    openExternal: (href: string) => Promise<void>
  }

  recentFiles: {
    get: () => Promise<Script[]>
    set: (scripts: Script[]) => Promise<Script[]>
    clear: () => Promise<void>
    remove: (script: Script) => Promise<Script[]>

    select: {
      onAll: (cb: () => void) => Disposable
      onNone: (cb: () => void) => Disposable
      onInvertSelection: (cb: () => void) => Disposable
      onClear: (cb: () => void) => Disposable
    }

    dialog: {
      open: () => void
      close: () => void
    }
  }

  titlebar: {
    openMenu: (args: { x: number; y: number }) => Promise<void>
  }

  os: {
    platform: () => Platform
  }

  window: {
    close: () => Promise<void>
    minimize: () => Promise<WindowState>
    maximize: () => Promise<WindowState>
    restore: () => Promise<WindowState>
    onStateChange: (cb: (state: WindowState) => void) => Disposable
  }
}
