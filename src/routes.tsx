import React from 'react'
import { Redirect, Router } from '@reach/router'
import CompilationPage from './pages/compilation-page/compilation-page'
import GroupsPage from './pages/groups-page/groups-page'
import SettingsPage from './pages/settings-page/settings-page'

const routes = [
  { path: 'compilation', Component: CompilationPage },
  { path: 'groups', Component: GroupsPage },
  { path: 'settings', Component: SettingsPage }
]

const Routes = () => (
  <Router>
    {routes.map(({ path, Component }) => (
      <Component
        key={path}
        path={path}
      />
    ))}
    <Redirect from="*" default noThrow to="/compilation" />
  </Router>
)

export default Routes
