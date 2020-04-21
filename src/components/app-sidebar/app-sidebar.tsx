import SettingsIcon from '@material-ui/icons/Settings'
import LayersIcon from '@material-ui/icons/Layers'
import CodeIcon from '@material-ui/icons/Code'
import React from 'react'
import './app-sidebar.scss'
import AppSidebarLink from '../app-sidebar-link/app-sidebar-link'
import appLogo from '../../assets/logo/app-mono/icons/png/1024x1024.png'

const AppSidebar: React.FC = () => {
  return (
    <div className="app-sidebar">
      <div className="app-sidebar-logo">
        <img
          src={appLogo}
          alt="app logo"
        />
      </div>
      <div className="app-sidebar-links">
        <AppSidebarLink to="/compilation">
          <CodeIcon />
        </AppSidebarLink>
        <AppSidebarLink to="/groups">
          <LayersIcon />
        </AppSidebarLink>
        <AppSidebarLink to="/settings">
          <SettingsIcon />
        </AppSidebarLink>
      </div>
    </div>
  )
}

export default AppSidebar
