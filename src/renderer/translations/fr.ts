/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

// noinspection SpellCheckingInspection

import { TranslationShape } from './translation-shape'

const fr: TranslationShape = {
  common: {
    refresh: 'Rafraîchir',
    selectFolder: 'Sélectionner un dossier',
    cancel: 'Annuler',
    logs: {
      nav: 'Logs',
      title: 'Logs de compilation',
      noLogs: 'Aucun logs',
      close: 'Fermer',
      scriptFailed: 'Problème avec le script {{script}} : {{message}}',
      scriptFailedCmd: 'Commande éxécutée : {{cmd}}',
      // Check if those trads are useful
      invalidConfigurationGame:
        "Le dossier {{folder}} n'est pas un dossier de jeu valide. Il ne contient pas {{exe}}.",
      invalidConfigurationCompiler:
        "{{exe}} n'est pas un compilateur valide. Le fichier n'existe pas.",
      invalidConfigurationScripts:
        "Votre configuration n'est pas valide. Impossible de valider l'installation de Creation Kit. " +
        "L'application vérifie la présence du fichier Actor.psc pour valider votre installation de Creation Kit. " +
        'Impossible de trouver le fichier Actor.psc dans les dossiers Source\\Scripts ou Scripts\\Source. ' +
        "Si vous utilisez l'intégration MO2 de l'application, " +
        'les dossiers overwrite et mods sont également vérifiés.',
    },
  },
  config: {
    checkError_game:
      'Configuration invalide: vérifiez le chemin du jeu. <linkToSettings>Plus de détails</linkToSettings>',
    checkError_compiler:
      'Configuration invalide: vérifiez le chemin du compilateur. <linkToSettings>Plus de détails</linkToSettings>',
    'checkError_mo2-instance':
      "Configuration invalide: vérifiez l'instance MO2. <linkToSettings>Plus de détails</linkToSettings>",
    checkError_scripts:
      "Configuration invalide: vérifiez l'installation de Creation Kit. " +
      '<linkToSettings>Plus de détails</linkToSettings>',
  },
  loading: 'Chargement',
  nav: {
    compilation: 'Compilation',
    groups: 'Groupes',
    settings: 'Paramètres',
    closePanel: 'Fermer',
    help: {
      text: 'Documentation',
      title: 'Lien vers la documentation',
      description:
        'Le lien suivant ouvrira la documentation de PCA dans le navigateur',
      goTo: 'Ouvrir',
      doNotShowAgain: 'Ne plus afficher',
    },
  },
  page: {
    compilation: {
      title: 'Compilation',
      actions: {
        searchScripts: 'Rechercher',
        loadGroup: 'Groupe',
        start: 'Lancer',
        clearList: 'Vider la liste',
        recentFiles: 'Fichiers récents',
      },
      dragAndDropText:
        "Vous pouvez glisser-déposer des fichiers psc pour les charger dans l'application.",
      dragAndDropAdmin:
        "Cette fonctionnalité n'est pas disponible si l'application est lancée en mode administrateur.",
      scriptItem: {
        removeFromList: 'Supprimer de la liste',
      },
      recentFilesDialog: {
        noRecentFiles: 'Aucun fichiers récents',
        load: 'Charger sélectionnés',
      },
    },
    groups: {
      title: 'Groupes',
      actions: {
        create: 'Créer',
        edit: 'Modifier',
        remove: 'Supprimer',
      },
      group: 'Groupe {{name}}',
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
      },
    },
    settings: {
      title: 'Paramètres',
      game: 'Jeu',
      gameFolderInfo: 'Dossier de {{gameType}} (où {{exe}} se trouve)',
      compilerPath: 'Où se trouve le fichier PapyrusCompiler.exe ?',
      errors: {
        installationInvalid: 'La configuration semble invalide :',
        scripts:
          "Vérifiez que votre installation de Creation Kit est valide. L'application vérifie la présence du fichier {{file}} dans les dossiers Scripts\\Source ou Source\\Scripts pour valider l'installation de votre Creation Kit. Si vous utilisez l'integration MO2 de l'application, les dossiers overwrite et mods sont également vérifiés.",
        game: 'Vérifiez que "{{exe}}" existe dans le dossier du jeu.',
        compiler: 'Vérifiez que "{{compilerExe}}" existe.',
        mo2Instance:
          'Vérifiez que le dossier de l\'instance "{{mo2Instance}}" existe.',
      },
      mo2: {
        enable: 'Activer',
        enableText: "uniquement si PCA n'est pas lancé à partir de MO2",
        instance: "Dossier de l'instance",
        limit: 'Limite {{limit}}',
        errorInstance:
          'Le dossier "{{folder}}" ne contient pas les dossiers {{requiredFolders}}.',
      },
      compilation: {
        title: 'Compilation',
        concurrentScripts: {
          label: 'Nombre de scripts compilés simultanéments',
          info: 'Réduisez si vous rencontrez des blocages quand vous lancez la compilation',
        },
      },
      telemetry: {
        title: "Données d'utilisation",
        enable: 'Activer',
      },
      version: 'Version {{version}}',
      theme: {
        title: 'Thème',
        options: {
          system: 'Système',
          light: 'Clair',
          dark: 'Sombre',
        },
      },
    },
  },
  changelog: {
    newVersion: 'Nouvelle version disponible',
    available: {
      view: 'Voir les nouveautés',
      message: 'Nouvelle version disponible : {{version}}',
    },
    alreadyLastVersion: 'Vous disposez de la dernière version',
  },
  tutorials: {
    close: 'Fermer',
    ok: 'OK',
    settings: {
      ask: {
        title: "Configurer l'application",
        text: "C'est la première fois que vous lancez l'application. Suivre le tutoriel ?",
        needHelp: "J'ai besoin d'aide",
      },
      game: {
        text: 'Ici, vous pouvez enregistrer les informations de votre jeu',
      },
      compiler: {
        text: "Ici, vous pouvez enregistrer le chemin vers le compilateur Papyrus. Disponible après l'installation de Creation Kit",
      },
      compilation: {
        concurrent: {
          text: 'Ici, vous pouvez enregistrer le nombre de scripts compilés simultanéments.',
        },
      },
      mo2: {
        text: "Ici, vous pouvez enregistrer vos informations MO2. Ignorez cette option, si vous utilisez l'application à travers MO2",
      },
    },
    telemetry: {
      text:
        "<0>À partir de la version 5.5.0, PCA collectera des données de télémétrie dans le but d'analyser les fonctionnalités utilisées et d'améliorer les fonctionnalités pertinentes.</0>" +
        '<1>Toutes les données transmises sont anonymes.</1>' +
        "<2>Des exemples de données collectées comprennent les données de groupe et de compilation, les erreurs, et les horodatages de divers événements d'application.</2>" +
        '<3>Les données de télémétrie sont désactivables dans les paramètres.</3>',
      close: "J'ai compris",
    },
  },
}

export default fr
