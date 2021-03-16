/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { GameType } from './game'

export enum TelemetryEvents {
  AppFirstLoaded = 'app-first-loaded',
  AppLoaded = 'app-loaded',
  CompilationDropScripts = 'compilation-drop-scripts',
  CompilationGroupLoaded = 'compilation-group-loaded',
  CompilationListEmpty = 'compilation-list-empty',
  CompilationLogsCopy = 'compilation-logs-copy',
  CompilationPlay = 'compilation-play',
  CompilationRemoveScript = 'compilation-remove-script',
  Exception = 'exception',
  GroupCreated = 'group-created',
  GroupDeleted = 'group-deleted',
  GroupDropScripts = 'group-drop-scripts',
  GroupEdited = 'group-edited',
  ModOrganizerActive = 'mod-organizer-active',
  SettingsGame = 'settings-game',
  SettingsRefresh = 'settings-refresh',
  TelemetryEnabled = 'telemetry-enabled',
  TutorialsSettingsEnd = 'tutorials-settings-end',
  TutorialsSettingsDeny = 'tutorials-settings-deny'
}

export interface TelemetryEventsProperties {
  [TelemetryEvents.AppFirstLoaded]: Record<string, never>
  [TelemetryEvents.AppLoaded]: Record<string, never>
  [TelemetryEvents.CompilationDropScripts]: {
    scripts: number
  }
  [TelemetryEvents.CompilationGroupLoaded]: {
    groups: number
  }
  [TelemetryEvents.CompilationListEmpty]: {
    scripts: number
  }
  [TelemetryEvents.CompilationLogsCopy]: Record<string, never>
  [TelemetryEvents.CompilationPlay]: {
    scripts: number
    concurrentScripts: number
  }
  [TelemetryEvents.CompilationRemoveScript]: {
    remainingScripts: number
  }
  [TelemetryEvents.Exception]: {
    error: string
    stack: string
  }
  [TelemetryEvents.GroupCreated]: {
    scripts: number
  }
  [TelemetryEvents.GroupDeleted]: Record<string, never>
  [TelemetryEvents.GroupDropScripts]: {
    scripts: number
  }
  [TelemetryEvents.GroupEdited]: {
    scripts: number
  }
  [TelemetryEvents.ModOrganizerActive]: {
    active: boolean
  }
  [TelemetryEvents.SettingsGame]: {
    game: GameType
  }
  [TelemetryEvents.SettingsRefresh]: Record<string, never>
  [TelemetryEvents.TelemetryEnabled]: Record<string, never>
  [TelemetryEvents.TutorialsSettingsEnd]: Record<string, never>
  [TelemetryEvents.TutorialsSettingsDeny]: Record<string, never>
}
