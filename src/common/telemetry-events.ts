/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { GameType } from './game'

export enum TelemetryEvents {
  AppFirstLoaded = 'App.FirstLoaded',
  AppLoaded = 'App.Loaded',
  CompilationDropScripts = 'Compilation.DropScripts',
  CompilationGroupLoaded = 'Compilation.GroupLoaded',
  CompilationListEmpty = 'Compilation.ListEmpty',
  CompilationLogsCopy = 'Compilation.LogsCopy',
  CompilationPlay = 'Compilation.Play',
  CompilationRemoveScript = 'Compilation.RemoveScript',
  Exception = 'Exception',
  GroupCreated = 'Group.Created',
  GroupDeleted = 'Group.Deleted',
  GroupDropScripts = 'Group.DropScripts',
  GroupEdited = 'Group.Edited',
  ModOrganizerActive = 'ModOrganizer.Active',
  SettingsGame = 'Settings.Game',
  SettingsTheme = 'Settings.Theme',
  SettingsRefresh = 'Settings.Refresh',
  TelemetryEnabled = 'Telemetry.Enabled',
  TutorialsSettingsEnd = 'Tutorials.SettingsEnd',
  TutorialsSettingsDeny = 'Tutorials.SettingsDeny'
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
  [TelemetryEvents.SettingsTheme]: {
    theme: string
  }
  [TelemetryEvents.TelemetryEnabled]: Record<string, never>
  [TelemetryEvents.TutorialsSettingsEnd]: Record<string, never>
  [TelemetryEvents.TutorialsSettingsDeny]: Record<string, never>
}
