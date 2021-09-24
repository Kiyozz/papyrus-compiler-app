/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

export enum IpcEvent {
  filesStats = 'event-files-stats',
  compileScriptStart = 'event-compile-script-start',
  compileScriptFinish = 'event-compile-script-finish',
  checkInstallation = 'event-check-installation',
  configUpdate = 'event-config-update',
  configGet = 'event-config-get',
  clipboardCopy = 'event-clipboard-copy',
  appError = 'event-error',
  openDialog = 'event-open-dialog',
  isProduction = 'event-is-production',
  getVersion = 'event-get-version',
  checkForUpdates = 'event-check-for-updates',
  recentFilesGet = 'event-recent-files-get',
  recentFilesSet = 'event-recent-files-set',
  recentFilesClear = 'event-recent-files-clear',
  recentFilesSelectAll = 'event-recent-files-select-all',
  recentFilesSelectNone = 'event-recent-files-select-none',
  recentFilesInvertSelection = 'event-recent-files-invert-selection',
  recentFilesOnClear = 'event-recent-files-on-clear',
  recentFilesDialogOpen = 'event-recent-files-dialog-open',
  recentFilesDialogClose = 'event-recent-files-dialog-close',
  recentFileRemove = 'event-recent-file-remove',
  telemetry = 'event-telemetry',
  telemetryActive = 'event-telemetry-active',
  online = 'event-is-online',
  openMenu = 'event-open-menu',
}
