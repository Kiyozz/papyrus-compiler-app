/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

export default {
  nav: {
    compilation: 'Compilation',
    groups: 'Groupes',
    settings: 'Paramètres',
    closePanel: 'Fermer'
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
      dragAndDropText:
        "Vous pouvez glisser-déposer des fichiers psc pour les charger dans l'application.",
      dragAndDropAdmin:
        "Cette fonctionnalité n'est pas disponible si l'application est lancée en mode administrateur.",
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
      createGroupText:
        'Vous pouvez créer un groupe avec le bouton $t(page.groups.actions.create).',
      whatIsAGroup:
        'Un groupe est un ensemble de scripts qui peut être ajoutés rapidement à la compilation.',
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
      compilerPath: 'Où se trouve le fichier PapyrusCompiler.exe ?',
      errors: {
        installationInvalid: 'La configuration semble invalide :',
        scripts:
          "Vérifiez que votre installation de Creation Kit est valide. L'application vérifie la présence du fichier Actor.psc dans les dossiers Scripts\\Source ou Source\\Scripts pour valider l'installation de votre Creation Kit. Si vous utilisez l'integration MO2 de l'application, les dossiers overwrite et mods sont également vérifiés.",
        game: 'Vérifiez que "{{exe}}" existe dans le dossier du jeu.',
        compiler: 'Vérifiez que "{{compilerExe}}" existe.',
        mo2Instance:
          'Vérifiez que le dossier de l\'instance "{{mo2Instance}}" existe.'
      },
      mo2: {
        enable: 'Activer',
        enableText:
          "uniquement si l'application n'est pas lancé à partir de MO2",
        instance: "Dossier de l'instance",
        limit: 'Limite {{limit}}',
        errorInstance:
          'Le dossier "{{folder}}" ne contient pas les dossiers {{requiredFolders}}.'
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
      scriptFailedCmd: 'Commande éxécutée : {{cmd}}',
      invalidConfigurationGame:
        "Le dossier {{folder}} n'est pas un dossier de jeu valide. Il ne contient pas {{exe}}.",
      invalidConfigurationCompiler:
        "{{exe}} n'est pas un compilateur valide. Le fichier n'existe pas.",
      invalidConfigurationScripts:
        "Votre configuration n'est pas valide. Impossible de valider l'installation du Creation Kit. L'application vérifie la présence du fichier Actor.psc pour valider votre installation du Creation Kit. Impossible de trouver le fichier Actor.psc dans les dossiers Source\\Scripts ou Scripts\\Source. Si vous utilisez l'integration MO2 de l'application, les dossiers overwrite et mods sont également vérifiés."
    }
  }
}
