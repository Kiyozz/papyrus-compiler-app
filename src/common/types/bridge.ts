/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

// eslint-disable-next-line import/no-unresolved
import { PartialDeep } from 'type-fest'

import { TelemetryEvent, TelemetryEventProperties } from '../telemetry-event'
import { BadError } from './bad-error'
import { CompilationResult } from './compilation-result'
import { Config } from './config'
import { DialogType } from './dialog'
import { Disposable } from './disposable'
import { Platform } from './platform'
import { Script } from './script'
import { WindowState } from './window-state'

export type Bridge = {
  telemetry: {
    send: <T extends TelemetryEvent>(
      event: T,
      args: TelemetryEventProperties[T],
    ) => void
    setActive: (active: boolean) => void
  }

  getVersion: () => Promise<string>

  changelog: {
    on: (fn: (args: unknown) => unknown) => void
    off: (fn: (args: unknown) => unknown) => void
  }

  error: (error: Error) => void

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
    openExternal: (href: string) => void
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
    openMenu: (args: { x: number; y: number }) => void
  }

  os: {
    platform: () => Platform
  }

  window: {
    close: () => void
    minimize: () => Promise<WindowState>
    maximize: () => Promise<WindowState>
    restore: () => Promise<WindowState>
    onStateChange: (cb: (state: WindowState) => void) => Disposable
  }

  uuid: () => string
}
