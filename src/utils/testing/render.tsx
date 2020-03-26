import { render as originalRender, RenderOptions } from '@testing-library/react'
import { ConnectedRouter } from "connected-react-router"
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import createStore from '../../redux/stores/root.store'
import { extendQueries } from './extend-queries'

export function renderWithRedux(component: JSX.Element) {
  const { store, history } = createStore(createMemoryHistory())

  const result = originalRender((
    <Provider store={store}>
      <ConnectedRouter history={history}>
        {component}
      </ConnectedRouter>
    </Provider>
  ))

  return {
    ...result,
    store,
    history,
    ...extendQueries(result.container)
  }
}

export function render(ui: React.ReactElement, options?: Omit<RenderOptions, 'queries'>) {
  const result = originalRender(ui, options)

  return {
    ...result,
    ...extendQueries(result.container)
  }
}
