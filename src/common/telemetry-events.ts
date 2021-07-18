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
  groupCloseWithEnter = 'Group.CloseWithEnter',
  modOrganizerActive = 'ModOrganizer.Active',
  recentFilesLoaded = 'RecentFiles.Loaded',
  recentFileRemove = 'RecentFile.Remove',
  recentFilesClear = 'RecentFiles.Clear',
  recentFilesSelectAll = 'RecentFiles.SelectAll',
  recentFilesSelectNone = 'RecentFiles.SelectNone',
  recentFilesInvertSelection = 'RecentFiles.InvertSelection',
  recentFilesCloseWithEnter = 'RecentFiles.CloseWithEnter',
  settingsGame = 'Settings.Game',
  settingsTheme = 'Settings.Theme',
  settingsRefresh = 'Settings.Refresh',
  telemetryEnabled = 'Telemetry.Enabled',
  tutorialsSettingsEnd = 'Tutorials.SettingsEnd',
  tutorialsSettingsDeny = 'Tutorials.SettingsDeny',
}

export interface TelemetryEventsProperties {
  [TelemetryEvents.appFirstLoaded]: Record<string, never>
  [TelemetryEvents.appLoaded]: Record<'version', string>
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
  [TelemetryEvents.groupCloseWithEnter]: Record<string, never>
  [TelemetryEvents.modOrganizerActive]: {
    active: boolean
  }
  [TelemetryEvents.recentFilesLoaded]: Record<string, never>
  [TelemetryEvents.recentFilesClear]: Record<string, never>
  [TelemetryEvents.recentFilesSelectAll]: Record<string, never>
  [TelemetryEvents.recentFilesSelectNone]: Record<string, never>
  [TelemetryEvents.recentFilesInvertSelection]: Record<string, never>
  [TelemetryEvents.recentFileRemove]: Record<string, never>
  [TelemetryEvents.recentFilesCloseWithEnter]: Record<string, never>
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
