/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

export enum IpcEvent {
  filesStats = 'event-files-stats',
  compileScriptStart = 'event-compile-script-start',
  compileScriptFinish = 'event-compile-script-finish',
  configCheck = 'event-config-check',
  configUpdate = 'event-config-update',
  configGet = 'event-config-get',
  configReset = 'event-config-reset',
  clipboardCopy = 'event-clipboard-copy',
  appError = 'event-error',
  openDialog = 'event-open-dialog',
  isProduction = 'event-is-production',
  getVersion = 'event-get-version',
  platform = 'sync-platform',
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
  telemetrySetActive = 'event-telemetry-set-active',
  online = 'event-is-online',
  openMenu = 'event-open-menu',
  windowClose = 'event-window-close',
  windowMinimize = 'event-window-minimize',
  windowMaximize = 'event-window-maximize',
  windowRestore = 'event-window-restore',
  windowStateChange = 'event-window-state-change',
}
