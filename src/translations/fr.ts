export default {
  nav: {
    compilation: 'Compilation',
    groups: 'Groupes',
    settings: 'Paramètres'
  },
  page: {
    compilation: {
      title: 'Compilation',
      actions: {
        searchScripts: 'Rechercher',
        loadGroup: 'Groupe',
        start: 'Lancer',
        clearList: 'Vider la liste',
      },
      dragAndDropText: 'Vous pouvez glisser-déposer des fichiers psc pour les charger dans l\'application.',
      dragAndDropAdmin: 'Cette fonctionnalité n\'est pas disponible si l\'application est lancée en mode administrateur.',
      scriptItem: {
        lastModified: 'Modifié le {{date}}',
        removeFromList: 'Supprimer de la liste'
      }
    },
    groups: {
      title: 'Groupes',
      actions: {
        create: 'Créer',
        edit: 'Modifier',
        remove: 'Supprimer'
      },
      createGroupText: 'Vous pouvez créer un groupe avec le bouton $t(page.groups.actions.create).',
      whatIsAGroup: 'Un groupe est un ensemble de scripts qui peut être ajoutés rapidement à la compilation.',
      noScripts: 'Aucun scripts',
      dialog: {
        searchScripts: 'Rechercher',
        createGroup: 'Créer un groupe',
        editGroup: 'Modifier un groupe',
        name: 'Nom',
        dropScripts: 'Glisser-déposer vos scripts ici',
        close: 'Fermer'
      }
    },
    settings: {
      title: 'Paramètres'
    }
  }
}
