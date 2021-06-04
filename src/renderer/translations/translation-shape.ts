/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

export interface TranslationShape {
  loading: string
  nav: {
    compilation: string
    groups: string
    settings: string
    closePanel: string
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
        cancel: string
        noRecentFiles: string
        load: string
      }
    }
    groups: {
      title: string
      actions: {
        create: string
        edit: string
        remove: string
      }
      createGroupText: string
      whatIsAGroup: string
      noScripts: string
      dialog: {
        searchScripts: string
        createGroup: string
        editGroup: string
        name: string
        dropScripts: string
        cancel: string
      }
    }
    settings: {
      title: string
      actions: {
        refresh: string
      }
      game: string
      gameFolderInfo: string
      compilerPath: string
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
  common: {
    selectFolder: string
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
