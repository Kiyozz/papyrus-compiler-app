/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */
export type TranslationShape = {
  contextMenu: {
    select: {
      all: string
      none: string
      invert: string
      clear: string
    }
  }
  appMenu: {
    app: {
      about: string
      hideSelf: string
      hideOthers: string
      showAll: string
      quit: string
      preferences: {
        title: string
        actions: {
          configuration: string
          reset: string
        }
      }
      checkForUpdates: string
    }
    file: {
      title: string
      actions: {
        logs: string
        previousLogs: {
          title: string
          actions: {
            logs: string
          }
        }
      }
    }
    edit: {
      title: string
      actions: {
        undo: string
        redo: string
        cut: string
        copy: string
        paste: string
        selectAll: string
      }
    }
    view: {
      title: string
      actions: {
        reload: string
        fullScreen: string
        devTools: string
      }
    }
    window: {
      title: string
      actions: {
        minimize: string
        close: string
      }
    }
    help: {
      title: string
      actions: {
        report: string
        github: string
      }
    }
  }
}
