/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

export interface TranslationShape {
  common: {
    refresh: string
    selectFolder: string
    cancel: string
    documentation: string
    copy: string
    logs: {
      nav: string
      title: string
      noLogs: string
      close: string
      scriptFailed: string
      scriptFailedCmd: string
      invalidConfigurationGame: string
      invalidConfigurationCompiler: string
      invalidConfigurationScripts: string
    }
  }
  loading: string
  nav: {
    compilation: string
    groups: string
    settings: string
    closePanel: string
    help: {
      text: string
      title: string
      description: string
      goTo: string
      doNotShowAgain: string
    }
  }
  config: {
    checkError_game: string
    checkError_compiler: string
    checkError_scripts: string
    'checkError_mo2-instance': string
  }
  page: {
    compilation: {
      title: string
      actions: {
        searchScripts: string
        loadGroup: string
        start: string
        clearList: string
        recentFiles: string
      }
      dragAndDropText: string
      dragAndDropAdmin: string
      scriptItem: {
        removeFromList: string
      }
      recentFilesDialog: {
        noRecentFiles: string
        load: string
        moreDetails: string
      }
    }
    groups: {
      title: string
      actions: {
        create: string
        edit: string
        remove: string
      }
      group: string
      createGroupText: string
      whatIsAGroup: string
      noScripts: string
      dialog: {
        searchScripts: string
        createGroup: string
        editGroup: string
        name: string
        dropScripts: string
      }
    }
    settings: {
      title: string
      game: string
      gameFolderInfo: string
      gameFolderTooltip: string
      compilerPath: string
      compilerPathTooltip: string
      errors: {
        installationInvalid: string
        scripts: string
        game: string
        compiler: string
        mo2Instance: string
      }
      mo2: {
        enable: string
        enableText: string
        instance: string
        limit: string
        errorInstance: string
      }
      compilation: {
        title: string
        concurrentScripts: {
          label: string
          info: string
        }
      }
      telemetry: {
        title: string
        enable: string
      }
      version: string
      theme: {
        title: string
        options: {
          system: string
          light: string
          dark: string
        }
      }
    }
  }
  changelog: {
    newVersion: string
    available: {
      view: string
      message: string
    }
    alreadyLastVersion: string
  }
  tutorials: {
    close: string
    ok: string
    settings: {
      ask: {
        title: string
        text: string
        needHelp: string
      }
      game: {
        text: string
      }
      compiler: {
        text: string
      }
      compilation: {
        concurrent: {
          text: string
        }
      }
      mo2: {
        text: string
      }
    }
    telemetry: {
      text: string
      close: string
    }
  }
}
