/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import CodeIcon from '@mui/icons-material/Code'
import LayersIcon from '@mui/icons-material/Layers'
import SettingsIcon from '@mui/icons-material/Settings'
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import cx from 'classnames'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useDrawer } from '../hooks/use-drawer'
import { useTitlebarHeight } from '../hooks/use-titlebar-height'
import ActiveLink from './active-link'
import DrawerButton from './drawer-button'
import OpenCompilationLogs from './open-compilation-logs'
import OpenDocumentation from './open-documentation'

const PageDrawer = () => {
  const [isDrawerExpand, setDrawerExpand] = useDrawer()
  const { t } = useTranslation()
  const titlebarHeight = useTitlebarHeight()

  const links = useMemo(
    () => [
      {
        Icon: CodeIcon,
        text: t('nav.compilation'),
        path: '/compilation',
      },
      {
        Icon: LayersIcon,
        text: t('nav.groups'),
        path: '/groups',
      },
      {
        Icon: SettingsIcon,
        text: t('nav.settings'),
        path: '/settings',
      },
    ],
    [t],
  )

  const onDrawerExpandClick = () => setDrawerExpand(c => !c)

  return (
    <Drawer
      variant="permanent"
      open={isDrawerExpand}
      classes={{
        paper: cx(
          'overflow-x-hidden transition-[width] ease-sharp duration-225',
          isDrawerExpand ? 'w-48' : 'w-14',
        ),
      }}
      PaperProps={{
        sx: {
          top: titlebarHeight + 64,
          height: `calc(100% - ${titlebarHeight + 64}px)`,
        },
      }}
    >
      <List>
        {links.map(Link => {
          return (
            <ListItem key={Link.path} disablePadding>
              <ListItemButton
                component={ActiveLink}
                to={Link.path}
                activeClassName="link-active"
              >
                <ListItemIcon>
                  <Link.Icon />
                </ListItemIcon>
                <ListItemText primary={Link.text} />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
      <List className="mt-auto">
        <OpenCompilationLogs />
        <OpenDocumentation />
        <DrawerButton
          icon={isDrawerExpand ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          text={t('nav.closePanel')}
          onClick={onDrawerExpandClick}
        />
      </List>
    </Drawer>
  )
}

export default PageDrawer
