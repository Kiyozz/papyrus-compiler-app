import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import './app-content.scss'
import AppCompilation from '../../pages/app-compilation/app-compilation.container'
import AppGroups from '../../pages/app-groups/app-groups.container'
import AppSettings from '../../pages/app-settings/app-settings.container'
import { ConnectedRouter } from 'connected-react-router'
import { history } from '../../redux/stores/root.store'

export interface StateProps {}

export interface DispatchesProps {}

type Props = StateProps & DispatchesProps

const routes = [
  { path: '/compilation', component: AppCompilation },
  { path: '/groups', component: AppGroups },
  { path: '/settings', component: AppSettings }
]

const AppContent: React.FC<Props> = () => {
  return (
    <div className="app-content">
      <ConnectedRouter history={history}>
        <Switch>
          {routes.map(({ path, component: Component }) => (
            <Route
              key={path}
              path={path}
              component={Component}
            />
          ))}
          <Redirect to="/compilation" />
        </Switch>
      </ConnectedRouter>
    </div>
  )
}

export default AppContent
