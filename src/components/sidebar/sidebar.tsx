import CodeIcon from '@material-ui/icons/Code'
import LayersIcon from '@material-ui/icons/Layers'
import SettingsIcon from '@material-ui/icons/Settings'

import React from 'react'

import appLogo from '../../assets/logo/app-mono/icons/png/1024x1024.png'
import SidebarLink from './sidebar-link'
import classes from './sidebar.module.scss'

const Sidebar: React.FC = () => {
  return (
    <div className={classes.sidebar}>
      <div className={classes.logo}>
        <img
          src={appLogo}
          alt="app logo"
        />
      </div>
      <div className={classes.links}>
        <SidebarLink to="/compilation">
          <CodeIcon />
        </SidebarLink>
        <SidebarLink to="/groups">
          <LayersIcon />
        </SidebarLink>
        <SidebarLink to="/settings">
          <SettingsIcon />
        </SidebarLink>
      </div>
    </div>
  )
}

export default Sidebar
