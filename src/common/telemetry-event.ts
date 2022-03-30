/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import type { GameType } from './game'

export enum TelemetryEvent {
  appFirstLoaded = 'App.FirstLoaded',
  appLoaded = 'App.Loaded',
  compilationDropScripts = 'Compilation.DropScripts',
  compilationGroupLoaded = 'Compilation.GroupLoaded',
  compilationListEmpty = 'Compilation.ListEmpty',
  compilationLogsCopy = 'Compilation.LogsCopy',
  compilationPlay = 'Compilation.Play',
  compilationSinglePlay = 'Compilation.SinglePlay',
  compilationRemoveScript = 'Compilation.RemoveScript',
  exception = 'Exception',
  groupCreated = 'Group.Created',
  groupDeleted = 'Group.Deleted',
  groupDropScripts = 'Group.DropScripts',
  groupEdited = 'Group.Edited',
  groupCloseWithEnter = 'Group.CloseWithEnter',
  groupMoreDetails = 'Group.MoreDetails',
  modOrganizerActive = 'ModOrganizer.Active',
  recentFilesLoaded = 'RecentFiles.Loaded',
  recentFileRemove = 'RecentFile.Remove',
  recentFilesClear = 'RecentFiles.Clear',
  recentFilesSelectAll = 'RecentFiles.SelectAll',
  recentFilesSelectNone = 'RecentFiles.SelectNone',
  recentFilesInvertSelection = 'RecentFiles.InvertSelection',
  recentFilesCloseWithEnter = 'RecentFiles.CloseWithEnter',
  recentFilesMoreDetails = 'RecentFiles.MoreDetails',
  settingsGame = 'Settings.Game',
  settingsTheme = 'Settings.Theme',
  settingsRefresh = 'Settings.Refresh',
  telemetryEnabled = 'Telemetry.Enabled',
  tutorialsSettingsEnd = 'Tutorials.SettingsEnd',
  tutorialsSettingsDeny = 'Tutorials.SettingsDeny',
  tutorialsSettingsSkip = 'Tutorials.SettingsSkip',
  documentationOpenFromNav = 'Documentation.OpenFromNav',
}

export interface TelemetryEventProperties {
  [TelemetryEvent.appFirstLoaded]: Record<string, never>
  [TelemetryEvent.appLoaded]: Record<'version' | 'releaseVersion', string>
  [TelemetryEvent.compilationDropScripts]: { scripts: number }
  [TelemetryEvent.compilationGroupLoaded]: { groups: number }
  [TelemetryEvent.compilationListEmpty]: { scripts: number }
  [TelemetryEvent.compilationLogsCopy]: Record<string, never>
  [TelemetryEvent.compilationPlay]: {
    scripts: number
    concurrentScripts: number
  }
  [TelemetryEvent.compilationSinglePlay]: Record<string, never>
  [TelemetryEvent.compilationRemoveScript]: { remainingScripts: number }
  [TelemetryEvent.exception]: {
    error: string
    stack: string
  }
  [TelemetryEvent.groupCreated]: { scripts: number }
  [TelemetryEvent.groupDeleted]: Record<string, never>
  [TelemetryEvent.groupDropScripts]: { scripts: number }
  [TelemetryEvent.groupEdited]: { scripts: number }
  [TelemetryEvent.groupCloseWithEnter]: Record<string, never>
  [TelemetryEvent.groupMoreDetails]: { moreDetails: boolean }
  [TelemetryEvent.modOrganizerActive]: { active: boolean }
  [TelemetryEvent.recentFilesLoaded]: Record<string, never>
  [TelemetryEvent.recentFilesClear]: Record<string, never>
  [TelemetryEvent.recentFilesSelectAll]: Record<string, never>
  [TelemetryEvent.recentFilesSelectNone]: Record<string, never>
  [TelemetryEvent.recentFilesInvertSelection]: Record<string, never>
  [TelemetryEvent.recentFileRemove]: Record<string, never>
  [TelemetryEvent.recentFilesCloseWithEnter]: Record<string, never>
  [TelemetryEvent.recentFilesMoreDetails]: { moreDetails: boolean }
  [TelemetryEvent.settingsGame]: { game: GameType }
  [TelemetryEvent.settingsRefresh]: Record<string, never>
  [TelemetryEvent.settingsTheme]: { theme: string }
  [TelemetryEvent.telemetryEnabled]: Record<string, never>
  [TelemetryEvent.tutorialsSettingsEnd]: Record<string, never>
  [TelemetryEvent.tutorialsSettingsDeny]: Record<string, never>
  [TelemetryEvent.tutorialsSettingsSkip]: { step: number }
  [TelemetryEvent.documentationOpenFromNav]: {
    reason: 'enter' | 'click' | 'settings-app-bar'
  }
}
