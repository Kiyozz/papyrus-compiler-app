/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { GameType } from './game'

export enum TelemetryEvents {
  appFirstLoaded = 'App.FirstLoaded',
  appLoaded = 'App.Loaded',
  compilationDropScripts = 'Compilation.DropScripts',
  compilationGroupLoaded = 'Compilation.GroupLoaded',
  compilationListEmpty = 'Compilation.ListEmpty',
  compilationLogsCopy = 'Compilation.LogsCopy',
  compilationPlay = 'Compilation.Play',
  compilationRemoveScript = 'Compilation.RemoveScript',
  exception = 'Exception',
  groupCreated = 'Group.Created',
  groupDeleted = 'Group.Deleted',
  groupDropScripts = 'Group.DropScripts',
  groupEdited = 'Group.Edited',
  modOrganizerActive = 'ModOrganizer.Active',
  settingsGame = 'Settings.Game',
  settingsTheme = 'Settings.Theme',
  settingsRefresh = 'Settings.Refresh',
  telemetryEnabled = 'Telemetry.Enabled',
  tutorialsSettingsEnd = 'Tutorials.SettingsEnd',
  tutorialsSettingsDeny = 'Tutorials.SettingsDeny',
}

export interface TelemetryEventsProperties {
  [TelemetryEvents.appFirstLoaded]: Record<string, never>
  [TelemetryEvents.appLoaded]: Record<string, never>
  [TelemetryEvents.compilationDropScripts]: {
    scripts: number
  }
  [TelemetryEvents.compilationGroupLoaded]: {
    groups: number
  }
  [TelemetryEvents.compilationListEmpty]: {
    scripts: number
  }
  [TelemetryEvents.compilationLogsCopy]: Record<string, never>
  [TelemetryEvents.compilationPlay]: {
    scripts: number
    concurrentScripts: number
  }
  [TelemetryEvents.compilationRemoveScript]: {
    remainingScripts: number
  }
  [TelemetryEvents.exception]: {
    error: string
    stack: string
  }
  [TelemetryEvents.groupCreated]: {
    scripts: number
  }
  [TelemetryEvents.groupDeleted]: Record<string, never>
  [TelemetryEvents.groupDropScripts]: {
    scripts: number
  }
  [TelemetryEvents.groupEdited]: {
    scripts: number
  }
  [TelemetryEvents.modOrganizerActive]: {
    active: boolean
  }
  [TelemetryEvents.settingsGame]: {
    game: GameType
  }
  [TelemetryEvents.settingsRefresh]: Record<string, never>
  [TelemetryEvents.settingsTheme]: {
    theme: string
  }
  [TelemetryEvents.telemetryEnabled]: Record<string, never>
  [TelemetryEvents.tutorialsSettingsEnd]: Record<string, never>
  [TelemetryEvents.tutorialsSettingsDeny]: Record<string, never>
}
