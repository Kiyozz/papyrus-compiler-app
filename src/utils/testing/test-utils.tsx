import { render } from '@testing-library/react'
import { ConnectedRouter } from 'connected-react-router'
import { createMemoryHistory } from 'history'
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
  const { store, history } = createStore(createMemoryHistory())

  return {
    ...render((
      <Provider store={store}>
        <ConnectedRouter history={history}>
          {component}
        </ConnectedRouter>
      </Provider>
    )),
    store,
    history
  }
}

export * from '@testing-library/react'
