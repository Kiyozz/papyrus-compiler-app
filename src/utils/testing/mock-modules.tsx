import React from 'react'

const mockedModules: any = {
  'electron-log': {
    transports: {
      file: {
        findLogPath: jest.fn()
      }
    }
  },
  'electron': {
    ipcRenderer: {
      removeListener: jest.fn(),
      once: jest.fn(),
      send: jest.fn()
    },
    shell: {
      openExternal: jest.fn()
    }
  }
}

export function mockElectronRequire() {
  return jest.fn((moduleAsked: string) => {
    return mockedModules[moduleAsked] ?? {}
  })
}
