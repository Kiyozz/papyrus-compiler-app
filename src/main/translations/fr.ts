/*
 *   Copyright (c) 2021 Kiyozz
 *   All rights reserved.
 */

import { TranslationShape } from './translation-shape'

const fr: TranslationShape = {
  contextMenu: {
    select: {
      all: 'Tout sélectioner',
      none: 'Tout désélectionner',
      invert: 'Inverser la sélection',
      clear: 'Vider',
    },
  },
  appMenu: {
    app: {
      about: 'À propos de {{app}}',
      hideSelf: 'Masquer {{app}}',
      hideOthers: 'Masquer les autres',
      showAll: 'Afficher tout',
      quit: 'Quitter {{app}}',
      preferences: {
        title: 'Préférences...',
        actions: {
          open: 'Ouvrir',
          reset: 'Réinitialiser',
        },
      },
      checkForUpdates: 'Rechercher les mises à jour...',
    },
    file: {
      title: 'Fichier',
      actions: {
        logs: 'Rapports...',
        previousLogs: {
          title: 'Session précédente...',
          actions: {
            logs: 'Rapports...',
          },
        },
      },
    },
    edit: {
      title: 'Édition',
      actions: {
        undo: 'Annuler',
        redo: 'Rétablir',
        cut: 'Couper',
        copy: 'Copier',
        paste: 'Coller',
        selectAll: 'Sélectionner tout',
      },
    },
    view: {
      title: 'Présentation',
      actions: {
        reload: 'Recharger',
        fullScreen: 'Activer le mode plein écran',
        devTools: 'Outils de développement',
      },
    },
    window: {
      title: 'Fenêtre',
      actions: {
        minimize: 'Réduire',
        close: 'Fermer',
      },
    },
    help: {
      title: 'Aide',
      actions: {
        report: 'Signaler un bug...',
        github: 'Github...',
      },
    },
  },
}

export default fr
