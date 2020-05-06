import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import CompilationPage from './pages/compilation-page/compilation-page'
import GroupsPage from './pages/groups-page/groups-page'
import SettingsPage from './pages/settings-page/settings-page'

const routes = [
  { path: '/compilation', component: CompilationPage },
  { path: '/groups', component: GroupsPage },
  { path: '/settings', component: SettingsPage }
]

const Routes = () => (
  <Switch>
    {routes.map(({ path, component }) => (
      <Route
        key={path}
        path={path}
        component={component}
      />
    ))}
    <Redirect to="/compilation" />
  </Switch>
)

export default Routes
