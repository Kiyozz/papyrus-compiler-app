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

function PageDrawer() {
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
      PaperProps={{
        sx: {
          top: titlebarHeight + 64,
          height: `calc(100% - ${titlebarHeight + 64}px)`,
        },
      }}
      classes={{
        paper: cx(
          'overflow-x-hidden transition-[width] ease-sharp duration-225',
          isDrawerExpand ? 'w-48' : 'w-14',
        ),
      }}
      open={isDrawerExpand}
      variant="permanent"
    >
      <List>
        {links.map(Link => {
          return (
            <ListItem disablePadding key={Link.path}>
              <ListItemButton
                activeClassName="link-active"
                component={ActiveLink}
                to={Link.path}
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
          onClick={onDrawerExpandClick}
          text={t('common.close')}
        />
      </List>
    </Drawer>
  )
}

export default PageDrawer
