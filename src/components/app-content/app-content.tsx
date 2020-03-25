import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import './app-content.scss'
import AppCompilation from '../../pages/app-compilation/app-compilation.container'
import AppGroups from '../../pages/app-groups/app-groups.container'
import AppSettings from '../../pages/app-settings/app-settings.container'

const routes = [
  { path: '/compilation', component: AppCompilation },
  { path: '/groups', component: AppGroups },
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
