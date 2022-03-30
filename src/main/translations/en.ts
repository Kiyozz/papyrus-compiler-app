/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import type { TranslationShape } from './translation-shape'

export const en: TranslationShape = {
  contextMenu: {
    select: {
      all: 'Select all',
      none: 'Select none',
      invert: 'Invert selection',
      clear: 'Clear',
    },
  },
  appMenu: {
    app: {
      about: 'About {{app}}',
      hideSelf: 'Hide {{app}}',
      hideOthers: 'Hide Others',
      showAll: 'Show All',
      quit: 'Quit {{app}}',
      preferences: {
        title: 'Preferences...',
        actions: {
          configuration: 'Configuration...',
          reset: 'Reset',
        },
      },
      checkForUpdates: 'Check for Updates...',
    },
    file: {
      title: 'File',
      actions: {
        logs: 'Logs...',
        previousLogs: {
          title: 'Previous Session...',
          actions: {
            logs: 'Logs...',
          },
        },
      },
    },
    edit: {
      title: 'Edit',
      actions: {
        undo: 'Undo',
        redo: 'Redo',
        cut: 'Cut',
        copy: 'Copy',
        paste: 'Paste',
        selectAll: 'Select All',
      },
    },
    view: {
      title: 'View',
      actions: {
        reload: 'Reload',
        fullScreen: 'Toggle Full Screen',
        devTools: 'Toggle Developer Tools',
      },
    },
    window: {
      title: 'Window',
      actions: {
        minimize: 'Minimize',
        close: 'Close',
      },
    },
    help: {
      title: 'Help',
      actions: {
        report: 'Report bug',
        github: 'Github',
      },
    },
  },
}
