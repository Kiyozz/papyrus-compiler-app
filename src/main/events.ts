/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

export enum Events {
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
  changelog = 'event-changelog',
  telemetry = 'event-telemetry',
  telemetryActive = 'event-telemetry-active',
  online = 'event-is-online',
}
