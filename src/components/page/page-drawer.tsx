import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import CodeIcon from '@material-ui/icons/Code'
import LayersIcon from '@material-ui/icons/Layers'
import SettingsIcon from '@material-ui/icons/Settings'

import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import AppIcon from '../../assets/logo/vector/app-icon'
import OpenCompilationLogs from '../open-compilation-logs/open-compilation-logs'
import OpenLogFileAction from '../open-log-file-action/open-log-file-action'
import { usePageContext } from './page-context'
import classes from './page.module.scss'

interface Props {
}

const PageDrawer: React.FC<Props> = () => {
  const { setOpen } = usePageContext()

  const onClick = () => setOpen(false)

  const links = [
    {
      Icon: CodeIcon,
      text: 'Compilation',
      path: '/compilation'
    },
    {
      Icon: LayersIcon,
      text: 'Groups',
      path: '/groups'
    },
    {
      Icon: SettingsIcon,
      text: 'Settings',
      path: '/settings'
    }
  ]

  const { pathname } = useLocation()

  return (
    <nav>
      <Drawer
        anchor="left"
        container={document.body}
        variant="permanent"
        onClose={() => setOpen(false)}
        classes={{
          paper: classes.drawer
        }}
      >
        <Box bgcolor="background.default" className={classes.box}>
          <div className={classes.drawerTop}>
            <AppIcon fontSize="large" color="primary" />
            <Typography className={classes.titleApp} variant="h5" component="h1">Papyrus Compiler</Typography>
          </div>
          <Divider />
          <List>
            {links.map(Link => {
              const isActive = pathname === Link.path

              return (
                <NavLink key={Link.path} activeClassName={classes.active} className={classes.link} to={Link.path} onClick={onClick}>
                  <Box bgcolor={isActive ? 'primary.main' : ''} className={classes.drawerLink}>
                    <ListItem button disableRipple>
                      <ListItemIcon color="inherit">
                        <Link.Icon />
                      </ListItemIcon>
                      <ListItemText primary={Link.text} />
                    </ListItem>
                  </Box>
                </NavLink>
              )
            })}
          </List>
          <List className={classes.listSecondary}>
            <OpenLogFileAction />
            <OpenCompilationLogs />
          </List>
        </Box>
      </Drawer>
    </nav>
  )
}

export default PageDrawer
