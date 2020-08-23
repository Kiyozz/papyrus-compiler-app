export default {
  nav: {
    compilation: 'Compilation',
    groups: 'Groups',
    settings: 'Settings'
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
      dragAndDropText: 'You can drag and drop psc files to load them into the application.',
      dragAndDropAdmin: 'This is only available when not running in administrator.',
      scriptItem: {
        lastModified: 'Last edited at {{date}}',
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
      whatIsAGroup: 'A group is a set of scripts that can be easily loaded on the compilation view.',
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
      gameFolderInfo: '{{game}} folder (where {{exe}} is located)',
      errors: {
        installationInvalid: 'Installation seems invalid:',
        installationInvalidInfo: 'Check if you have extracted Scripts.zip from Creation Kit.'
      },
      mo2: {
        enable: 'Enable',
        enableText: 'Only enable this option when the app is not started from MO2.',
        instance: 'MO2 Instance folder',
        limit: 'Limit {{limit}}',
        errorInstance: 'The folder "{{folder}}" does not contains {{requiredFolders}} folders.'
      },
      version: 'Version {{version}}'
    }
  },
  changelog: {
    newVersion: 'New version available'
  },
  common: {
    selectFolder: 'Select a folder',
    logs: {
      nav: 'Compilation logs',
      title: 'Compilation logs',
      noLogs: 'No logs',
      close: 'Close',
      scriptFailed: 'Script {{script}} failed to compile: {{message}}',
      scriptFailedCmd: 'Executed command: {{cmd}}',
      invalidConfiguration: '{{folder}} is a invalid Skyrim directory. The folder does not contains {{exe}}.'
    }
  }
}
