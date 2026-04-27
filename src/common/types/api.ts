/*
 * 2022-2026 Kiyozz.
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
import type { Platform } from './platform'
import type { Script } from './script'
import type { WindowState } from './window-state'

export interface MainAPI {
  telemetry: {
    send<T extends TelemetryEvent>(
      event: T,
      args: TelemetryEventProperties[T],
    ): Promise<void>
    setActive(active: boolean): Promise<void>
  }
  getVersion(): Promise<string>
  error(err: { name: string; message: string; stack?: string }): Promise<void>
  online(online: boolean): Promise<void>
  clipboard: {
    copy(text: string): Promise<void>
  }
  config: {
    update(
      partialConfig: PartialDeep<Config>,
      override?: boolean,
    ): Promise<Config>
    get(): Promise<Config>
    check(): Promise<BadError>
  }
  isProduction(): Promise<boolean>
  compilation: {
    start(
      script: string,
      onFinish: (result: CompilationResult) => void,
    ): Promise<void>
  }
  dialog: {
    select(type: DialogType): Promise<string | null>
  }
  recentFiles: {
    get(): Promise<Script[]>
    set(scripts: Script[]): Promise<Script[]>
    clear(): Promise<void>
    remove(script: Script): Promise<Script[]>
    dialog: {
      open(): Promise<void>
      close(): Promise<void>
    }
  }
  shell: {
    openExternal(href: string): Promise<void>
  }
  titlebar: {
    openMenu(args: { x: number; y: number }): Promise<void>
  }
  os: {
    platform(): Promise<Platform>
  }
  window: {
    close(): Promise<void>
    minimize(): Promise<void>
    maximize(): Promise<void>
    restore(): Promise<void>
  }
}

export interface RendererAPI {
  changelog: {
    onUpdate(info: unknown): Promise<void>
  }
  config: {
    onReset(): Promise<void>
  }
  recentFiles: {
    selectAll(): Promise<void>
    selectNone(): Promise<void>
    invertSelection(): Promise<void>
    onClear(): Promise<void>
  }
  window: {
    onStateChange(state: WindowState): Promise<void>
  }
}
