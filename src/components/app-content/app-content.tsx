import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import './app-content.scss'
import AppCompilation from '../../containers/app-compilation/app-compilation.container'
import AppGroups from '../../containers/app-groups/app-groups.container'
import AppSettings from '../../containers/app-settings/app-settings.container'
import AppNotFound from '../../pages/app-not-found/app-not-found'
import { ConnectedRouter } from 'connected-react-router'
import { history } from '../../redux/stores/root.store'

export interface StateProps {}

export interface DispatchesProps {}

type Props = StateProps & DispatchesProps

const AppContent: React.FC<Props> = () => {
  return (
    <div className="app-content">
      <ConnectedRouter history={history}>
        <Switch>
          <Route
            path="/compilation"
            component={AppCompilation}
          />
          <Route
            path="/groups"
            component={AppGroups}
          />
          <Route
            path="/settings"
            component={AppSettings}
          />
          <Redirect
            exact
            from="/"
            to="/compilation"
          />
          <Route
            path="/"
            component={AppNotFound}
          />
        </Switch>
      </ConnectedRouter>
    </div>
  )
}

export default AppContent
