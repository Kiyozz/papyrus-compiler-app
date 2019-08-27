import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import './app-sidebar.scss'
import AppSidebarLink from '../app-sidebar-link/app-sidebar-link'
import appLogo from '../../assets/papyrus-compiler-app.png'

export interface StateProps {}

export interface DispatchesProps {}

type Props = StateProps & DispatchesProps

const AppSidebar: React.FC<Props> = () => {
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
          <FontAwesomeIcon icon="file-code" />
        </AppSidebarLink>
        <AppSidebarLink to="/groups">
          <FontAwesomeIcon icon="layer-group" />
        </AppSidebarLink>
        <AppSidebarLink to="/settings">
          <FontAwesomeIcon icon="cog" />
        </AppSidebarLink>
      </div>
    </div>
  )
}

export default AppSidebar
