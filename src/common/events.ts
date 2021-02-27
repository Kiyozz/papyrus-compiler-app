/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

export enum Events {
  FilesStats = 'event-files-stats',
  CompileScriptStart = 'event-compile-script-start',
  CompileScriptFinish = 'event-compile-script-finish',
  CheckInstallation = 'event-check-installation',
  ConfigUpdate = 'event-config-update',
  ConfigGet = 'event-config-get',
  ClipboardCopy = 'event-clipboard-copy',
  AppError = 'event-error',
  OpenDialog = 'event-open-dialog',
  IsProduction = 'event-is-production',
  GetVersion = 'event-get-version',
  Changelog = 'event-changelog'
}
