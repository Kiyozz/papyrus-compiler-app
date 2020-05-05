import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import './app-content.scss'
import AppCompilation from '../../pages/app-compilation/app-compilation.container'
import GroupsPage from '../../pages/app-groups/groups-page'
import AppSettings from '../../pages/app-settings/app-settings.container'

const routes = [
  { path: '/compilation', component: AppCompilation },
  { path: '/groups', component: GroupsPage },
  { path: '/settings', component: AppSettings }
]

const AppContent: React.FC = () => {
  return (
    <div className="app-content">
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
    </div>
  )
}

export default AppContent
