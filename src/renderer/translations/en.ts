/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import type { TranslationShape } from './translation-shape'

export const en: TranslationShape = {
  common: {
    refresh: 'Refresh',
    selectFolder: 'Select a folder',
    cancel: 'Cancel',
    documentation: 'Documentation',
    copy: 'Copier',
    drop: 'Drop files',
    yes: 'Yes',
    no: 'No',
    remove: 'Remove',
    skip: 'Skip',
    close: 'Close',
    download: 'Download',
    moreDetails: 'More details',
    clear: 'Clear',
    logs: {
      nav: 'Logs',
      title: 'Compilation logs',
      noLogs: 'No logs',
      successCopy: 'Successfully copied',
      scriptFailed: 'Script {{script}} failed to compile: {{message}}',
      scriptFailedCmd: 'Executed command: {{cmd}}',
      invalidConfigurationGame:
        '{{folder}} is an invalid game folder. The folder does not contains {{exe}}.',
      invalidConfigurationCompiler:
        '{{exe}} is a invalid compiler. This file does not exists.',
      invalidConfigurationScripts:
        'Your configuration is incorrect. Cannot validate Creation Kit installation. ' +
        'The app checks the presence of Actor.psc to validate your Creation Kit installation. ' +
        'Cannot find the file Actor.psc in Source\\Scripts or Scripts\\Source. ' +
        "If you're using the app MO2 integration, the folders overwrite and mods are also checked.",
    },
  },
  config: {
    checkError_game: 'Invalid configuration: check your game path.',
    checkError_compiler: 'Invalid configuration: check your compiler path.',
    checkError_scripts:
      'Invalid configuration: check your Creation Kit installation.',
    'checkError_mo2-instance':
      'Invalid configuration: check your mo2 instance.',
    'checkError_mo2-instance-mods':
      'Invalid configuration: check your mo2 instance.',
    'checkError_mo2-use-no-instance':
      'Invalid configuration: mo2 integration is enabled, but your mo2 instance is invalid.',
  },
  loading: 'Loading',
  nav: {
    compilation: 'Compilation',
    groups: 'Groups',
    settings: 'Settings',
    help: {
      text: 'Documentation',
      title: 'Open the PCA documentation website?',
      description: 'This will learn you how to use PCA.',
      doNotShowAgain: "Don't show me that anymore",
    },
  },
  page: {
    compilation: {
      title: 'Compilation',
      actions: {
        searchScripts: 'Search scripts',
        group: 'Group',
        start: 'Start',
        clearList: 'Clear list',
        recentFiles: 'Recent files',
      },
      dragAndDropText: 'Start by dropping psc files to load them',
      dragAndDropAdmin:
        'This feature is not available when running PCA in administrator.',
      scriptItem: {
        removeFromList: 'Remove from list',
      },
      recentFilesDialog: {
        noRecentFiles: 'No recent files',
        load: 'Load',
      },
    },
    groups: {
      title: 'Groups',
      actions: {
        create: 'Create',
        edit: 'Edit',
        remove: 'Remove',
      },
      group: 'Group {{name}}',
      createGroupText: 'You can create a group with the top-right button.',
      whatIsAGroup:
        'A group is a set of scripts that can be easily loaded on the compilation view.',
      noScripts: 'No scripts',
      dialog: {
        searchScripts: 'Search scripts',
        name: 'Name',
        dropScripts: 'Drop your scripts files here',
      },
    },
    settings: {
      title: 'Settings',
      game: 'Game',
      gameFolderInfo: 'Game folder',
      gameFolderTooltip: 'Folder where {{exe}} is located.',
      compilerPath: 'Papyrus Compiler',
      compilerPathTooltip:
        "Path to PapyrusCompiler.exe. This file comes from the CreationKit installation. More details on PCA's documentation.",
      errors: {
        installationInvalid: 'Configuration seems invalid:',
        scripts:
          "Check that your Creation Kit installation is valid. The app checks the presence of {{file}} file in Scripts\\Source or Source\\Scripts folders to validate your Creation Kit installation. If you're using the app MO2 integration, the folders overwrite and mods are also checked.",
        game: 'Check that "{{exe}}" exists in the game folder.',
        compiler: 'Check that "{{compilerExe}}" exists.',
        mo2Instance: 'Check that instance folder "{{mo2Instance}}" exists.',
        mo2InstanceMods: 'Check that folder "mods" exists.',
      },
      mo2: {
        enable: 'Enable',
        enableText:
          "Enable MO2 integration only if PCA is not started from MO2. More details on PCA's documentation.",
        instance: 'Instance folder',
        limit: 'Limit {{limit}}',
        errorInstance:
          'The folder "{{folder}}" does not contains {{requiredFolders}} folders.',
      },
      compilation: {
        title: 'Compilation',
        concurrentScripts: {
          label: 'Number of concurrently compiled scripts',
          info: 'Reduce if you experience latency when starting the compilation',
        },
      },
      telemetry: {
        title: 'Telemetry',
        enable: 'Enable',
      },
      version: 'Version {{version}}',
      theme: {
        title: 'Theme',
        options: {
          system: 'System',
          light: 'Light',
          dark: 'Dark',
        },
      },
    },
  },
  changelog: {
    newVersion: 'New version available',
    changelogs: 'Changelogs',
    available: {
      notes: 'Changelogs',
      message: 'New version available: {{version}}',
    },
    alreadyLastVersion: 'PCA is up to date',
  },
  tutorials: {
    close: 'Close',
    ok: 'OK',
    settings: {
      documentation: 'You can read the documentation <1>here</1>.',
      ask: {
        title: 'Setup PCA',
        text: 'This is the first time you start PCA.',
        needHelp: 'I need help',
      },
      game: {
        text: 'Here, you can register your game information',
      },
      compiler: {
        text: 'Here, you can register your papyrus compiler. Available after Creation Kit installation',
      },
      compilation: {
        concurrent: {
          text: 'Here, you can register how many scripts that are concurrently compiled.',
        },
      },
      mo2: {
        text: 'Here, you can register your MO2 configuration. Ignore this if you are running the app through MO2',
      },
    },
    telemetry: {
      text:
        '<0>Starting with version 5.5.0, PCA will collect telemetry data for the purpose of analyzing used functionality and improving relevant features.</0>' +
        '<1>All transmitted data are anonymous.</1>' +
        '<2>Examples of collected data include group and compilation data, errors, and timestamps of various app events.</2>' +
        '<3>Data telemetry can be disabled in the settings.</3>',
      close: 'I get it',
    },
  },
}
