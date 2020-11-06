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
        clearList: 'Vider la liste'
      },
      dragAndDropText: "Vous pouvez glisser-déposer des fichiers psc pour les charger dans l'application.",
      dragAndDropAdmin: "Cette fonctionnalité n'est pas disponible si l'application est lancée en mode administrateur.",
      scriptItem: {
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
      title: 'Paramètres',
      actions: {
        refresh: 'Rafraîchir'
      },
      game: 'Jeu',
      gameFolderInfo: 'Dossier de {{gameType}} (où {{exe}} se trouve)',
      errors: {
        installationInvalid: 'Le dossier semble invalide :',
        installationInvalidInfo: 'Vérifiez que vous avez extrait le fichier Scripts.zip de Creation Kit ou que {{exe}} existe dans le dossier.'
      },
      mo2: {
        enable: 'Activer',
        enableText: "Activez cette option uniquement si l'application n'est pas lancé à partir de MO2.",
        instance: "Dossier de l'instance",
        limit: 'Limite {{limit}}',
        errorInstance: 'Le dossier "{{folder}}" ne contient pas les dossiers {{requiredFolders}}.'
      },
      version: 'Version {{version}}'
    }
  },
  changelog: {
    newVersion: 'Nouvelle version disponible',
    available: {
      view: 'Voir les nouveautés',
      message: 'Nouvelle version disponible : {{version}}'
    }
  },
  common: {
    selectFolder: 'Sélectionner un dossier',
    logs: {
      nav: 'Logs',
      title: 'Logs de compilation',
      noLogs: 'Aucun logs',
      close: 'Fermer',
      scriptFailed: 'Problème avec le script {{script}} : {{message}}',
      scriptFailedCmd: 'Commande : {{cmd}}',
      invalidConfiguration: 'Le dossier "{{folder}}" n\'est pas valide. Il ne contient pas "{{exe}}".'
    }
  }
}
