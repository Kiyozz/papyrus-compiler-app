import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Typography from '@material-ui/core/Typography'
import CodeIcon from '@material-ui/icons/Code'
import LayersIcon from '@material-ui/icons/Layers'
import SettingsIcon from '@material-ui/icons/Settings'

import React from 'react'
import { NavLink } from 'react-router-dom'

import AppIcon from '../../assets/logo/vector/app-icon'
import { usePageContext } from './page-context'
import classes from './page.module.scss'

interface Props {
}

const PageDrawer: React.FC<Props> = () => {
  const { setOpen } = usePageContext()

  const onClick = () => setOpen(false)

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
        <div className={classes.drawerTop}>
          <AppIcon fontSize="large" color="primary" />
          <Typography className={classes.titleApp} variant="h5" component="h1">Papyrus Compiler</Typography>
        </div>
        <Divider />
        <List>
          <NavLink activeClassName={classes.active} className={classes.link} to="/compilation" onClick={onClick}>
            <ListItem button disableRipple>
              <ListItemIcon color="inherit">
                <CodeIcon />
              </ListItemIcon>
               <ListItemText primary="Compilation" />
            </ListItem>
          </NavLink>
          <NavLink activeClassName={classes.active} className={classes.link} to="/groups" onClick={onClick}>
            <ListItem button disableRipple>
              <ListItemIcon color="inherit">
                <LayersIcon />
              </ListItemIcon>
               <ListItemText primary="Groups" />
            </ListItem>
          </NavLink>
          <NavLink activeClassName={classes.active} className={classes.link} to="/settings" onClick={onClick}>
            <ListItem button disableRipple>
              <ListItemIcon color="inherit">
                <SettingsIcon />
              </ListItemIcon>
               <ListItemText primary="Settings" />
            </ListItem>
          </NavLink>
        </List>
      </Drawer>
    </nav>
  )
}

export default PageDrawer
