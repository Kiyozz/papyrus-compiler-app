import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import createStore from '../../redux/stores/root.store'

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

export function mockFontAwesome() {
  jest.mock('@fortawesome/react-fontawesome', () => {
    return {
      FontAwesomeIcon: () => null
    }
  })
}

export function mockElectronRequire() {
  return jest.fn((moduleAsked: string) => {
    return mockedModules[moduleAsked] ?? {}
  })
}

export function renderWithRedux(component: JSX.Element) {
  const require = mockElectronRequire()
  const store = createStore()

  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
    require
  }
}

export * from '@testing-library/react'
