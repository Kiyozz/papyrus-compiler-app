/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

export default {
  loading: 'Loading',
  nav: {
    compilation: 'Compilation',
    groups: 'Groups',
    settings: 'Settings',
    closePanel: 'Close panel'
  },
  page: {
    compilation: {
      title: 'Compilation',
      actions: {
        searchScripts: 'Search scripts',
        loadGroup: 'Load group',
        start: 'Start',
        clearList: 'Clear list'
      },
      dragAndDropText:
        'You can drag and drop psc files to load them into the application.',
      dragAndDropAdmin:
        'This is only available when not running in administrator.',
      scriptItem: {
        removeFromList: 'Remove from list'
      }
    },
    groups: {
      title: 'Groups',
      actions: {
        create: 'Create',
        edit: 'Edit',
        remove: 'Remove'
      },
      createGroupText: 'You can create a group with the top-right button.',
      whatIsAGroup:
        'A group is a set of scripts that can be easily loaded on the compilation view.',
      noScripts: 'No scripts',
      dialog: {
        searchScripts: 'Search scripts',
        createGroup: 'Create a new group',
        editGroup: 'Edit a group',
        name: 'Name',
        dropScripts: 'Drop your scripts files here',
        close: 'Close'
      }
    },
    settings: {
      title: 'Settings',
      actions: {
        refresh: 'Refresh'
      },
      game: 'Game',
      gameFolderInfo: '{{gameType}} folder (where {{exe}} is located)',
      compilerPath: 'Where is the PapyrusCompiler.exe file located?',
      errors: {
        installationInvalid: 'Configuration seems invalid:',
        scripts:
          "Check that your Creation Kit installation is valid. The app checks the presence of Actor.psc file in Scripts\\Source or Source\\Scripts folders to validate your Creation Kit installation. If you're using the app MO2 integration, the folders overwrite and mods are also checked.",
        game: 'Check that "{{exe}}" exists in the game folder.',
        compiler: 'Check that "{{compilerExe}}" exists.',
        mo2Instance: 'Check that instance folder "{{mo2Instance}}" exists.'
      },
      mo2: {
        enable: 'Enable',
        enableText: 'only if the app is not started from MO2',
        instance: 'Instance folder',
        limit: 'Limit {{limit}}',
        errorInstance:
          'The folder "{{folder}}" does not contains {{requiredFolders}} folders.'
      },
      version: 'Version {{version}}'
    }
  },
  changelog: {
    newVersion: 'New version available',
    available: {
      view: 'View patch notes',
      message: 'New version available: {{version}}'
    }
  },
  common: {
    selectFolder: 'Select a folder',
    logs: {
      nav: 'Logs',
      title: 'Compilation logs',
      noLogs: 'No logs',
      close: 'Close',
      scriptFailed: 'Script {{script}} failed to compile: {{message}}',
      scriptFailedCmd: 'Executed command: {{cmd}}',
      invalidConfigurationGame:
        '{{folder}} is an invalid game folder. The folder does not contains {{exe}}.',
      invalidConfigurationCompiler:
        '{{exe}} is a invalid compiler. This file does not exists.',
      invalidConfigurationScripts:
        "Your configuration is incorrect. Cannot validate Creation Kit installation. The app checks the presence of Actor.psc to validate your Creation Kit installation. Cannot find the file Actor.psc in Source\\Scripts or Scripts\\Source. If you're using the app MO2 integration, the folders overwrite and mods are also checked.",
      invalidConfigurationMo2Instance:
        'Your configuration is incorrect. The mo2 instance at {{instance}} does not exist.'
    }
  },
  tutorials: {
    close: 'Close',
    ok: 'OK',
    settings: {
      ask: {
        title: 'Setup the application',
        text:
          'This is the first time you start the application. Do you need help?',
        needHelp: 'I need help'
      },
      game: {
        text: 'Here, you can register your game information'
      },
      compiler: {
        text:
          'Here, you can register your papyrus compiler. Available after Creation Kit installation'
      },
      mo2: {
        text:
          'Here, you can register your MO2 configuration. Ignore this if you are running the app through MO2'
      }
    }
  }
}
