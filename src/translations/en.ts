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
      title: 'Settings'
    }
  }
}
