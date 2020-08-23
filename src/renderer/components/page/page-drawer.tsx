import Box from '@material-ui/core/Box'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import CodeIcon from '@material-ui/icons/Code'
import LayersIcon from '@material-ui/icons/Layers'
import SettingsIcon from '@material-ui/icons/Settings'

import React, { useCallback, useMemo } from 'react'
import { useLocation } from '@reach/router'
import { useTranslation } from 'react-i18next'

import AppIcon from '../../assets/logo/vector/app-icon'
import { useStoreSelector } from '../../redux/use-store-selector'
import OpenCompilationLogs from '../open-compilation-logs/open-compilation-logs'
import { ActiveLink } from '../sidebar/sidebar-link'
import { usePageContext } from './page-context'
import classes from './page.module.scss'

const PageDrawer: React.FC = () => {
  const { setDrawerOpen } = usePageContext()
  const { t } = useTranslation()

  const onClick = useCallback(() => setDrawerOpen(false), [setDrawerOpen])

  const links = useMemo(
    () => [
      {
        Icon: CodeIcon,
        text: t('nav.compilation'),
        path: '/'
      },
      {
        Icon: LayersIcon,
        text: t('nav.groups'),
        path: '/groups'
      },
      {
        Icon: SettingsIcon,
        text: t('nav.settings'),
        path: '/settings'
      }
    ],
    [t]
  )

  const { pathname } = useLocation()
  const version = useStoreSelector(state => state.changelog.version)

  return (
    <nav>
      <Drawer
        anchor="left"
        container={document.body}
        variant="permanent"
        onClose={() => setDrawerOpen(false)}
        classes={{
          paper: classes.drawer
        }}
      >
        <Box bgcolor="background.default" className={classes.box}>
          <div className={classes.drawerTop}>
            <AppIcon fontSize="large" color="primary" />
            <Typography className={classes.titleApp} variant="h5" component="h1">
              PCA
              <Typography className={classes.titleAppVersion} component="span">
                {version}
              </Typography>
            </Typography>
          </div>
          <Divider />
          <List>
            {links.map(Link => {
              const isActive = pathname === Link.path

              return (
                <ActiveLink tabIndex={-1} key={Link.path} activeClassName={classes.active} className={classes.link} to={Link.path} onClick={onClick}>
                  <Box bgcolor={isActive ? 'primary.main' : ''} className={classes.drawerLink}>
                    <ListItem button disableRipple>
                      <ListItemIcon color="inherit">
                        <Link.Icon />
                      </ListItemIcon>
                      <ListItemText primary={Link.text} />
                    </ListItem>
                  </Box>
                </ActiveLink>
              )
            })}
          </List>
          <List className={classes.listSecondary}>
            <OpenCompilationLogs />
          </List>
        </Box>
      </Drawer>
    </nav>
  )
}

export default PageDrawer
