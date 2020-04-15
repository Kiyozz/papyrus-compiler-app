import SettingsIcon from '@material-ui/icons/Settings'
import LayersIcon from '@material-ui/icons/Layers'
import CodeIcon from '@material-ui/icons/Code'
import { withRouter, RouteComponentProps } from 'react-router'
import React from 'react'
import './app-sidebar.scss'
import FadeTransition from '../animations/fade-transition'
import AppCompilationLogs from '../app-compilation-logs/app-compilation-logs.container'
import AppOpenLogFile from '../app-open-log-file/app-open-log-file.container'
import AppSidebarLink from '../app-sidebar-link/app-sidebar-link'
import appLogo from '../../assets/logo/app-mono/icons/png/1024x1024.png'

export interface StateProps {}

export interface DispatchesProps {}

type Props = StateProps & DispatchesProps & RouteComponentProps

const AppSidebar: React.FC<Props> = ({ location }) => {
  console.log('wk: location', location)

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

      <FadeTransition active={location.pathname === '/compilation'}>
        <div className="app-sidebar-actions">
          <AppOpenLogFile />
          <AppCompilationLogs />
        </div>
      </FadeTransition>
    </div>
  )
}

export default withRouter(AppSidebar)
