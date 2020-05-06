import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import CodeIcon from '@material-ui/icons/Code'
import LayersIcon from '@material-ui/icons/Layers'
import SettingsIcon from '@material-ui/icons/Settings'

import React from 'react'
import { Link } from 'react-router-dom'
import { usePageContext } from './page-context'

import classes from './page.module.scss'

interface Props {
}

const PageDrawer: React.FC<Props> = () => {
  const { open, setOpen } = usePageContext()

  const onClick = () => setOpen(false)

  return (
    <nav>
      <Drawer
        anchor="left"
        container={document.body}
        variant="temporary"
        open={open}
        onClose={() => setOpen(false)}
        classes={{
          paper: classes.drawer
        }}
      >
        <List>
          <Link className={classes.link} to="/compilation" onClick={onClick}>
            <ListItem button disableRipple>
              <ListItemIcon>
                <CodeIcon />
              </ListItemIcon>
               <ListItemText primary="Compilation" />
            </ListItem>
          </Link>
          <Link className={classes.link} to="/groups" onClick={onClick}>
            <ListItem button disableRipple>
              <ListItemIcon>
                <LayersIcon />
              </ListItemIcon>
               <ListItemText primary="Groups" />
            </ListItem>
          </Link>
          <Link className={classes.link} to="/settings" onClick={onClick}>
            <ListItem button disableRipple>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
               <ListItemText primary="Settings" />
            </ListItem>
          </Link>
        </List>
      </Drawer>
    </nav>
  )
}

export default PageDrawer
