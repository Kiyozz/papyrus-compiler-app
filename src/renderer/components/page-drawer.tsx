/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import CodeIcon from '@material-ui/icons/Code'
import LayersIcon from '@material-ui/icons/Layers'
import SettingsIcon from '@material-ui/icons/Settings'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useDrawer } from '../hooks/use-drawer'
import ActiveLink from './active-link'
import Fade from './animations/fade'
import NavItem from './nav-item'
import OpenCompilationLogs from './open-compilation-logs'

const PageDrawer = () => {
  const [isDrawerExpand, setDrawerExpand] = useDrawer()
  const { t } = useTranslation()

  const onClick = () => setDrawerExpand(false)

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
    <nav
      className={`h-screen-appbar fixed left-0 top-24 transition-all duration-300 ${
        isDrawerExpand ? 'w-48' : 'w-14'
      } bg-light-600 dark:bg-black-800 select-none`}
    >
      <div className="h-full flex flex-col">
        <ul className="mt-2 flex flex-col gap-2">
          {links.map(Link => {
            return (
              <ActiveLink
                tabIndex={-1}
                key={Link.path}
                activeClassName="link-active"
                notFocusedActiveClassName="link-not-focused-active"
                className="link"
                to={Link.path}
                onClick={onClick}
              >
                <NavItem>
                  <Link.Icon />
                  <Fade in={isDrawerExpand}>
                    <div className="ml-6">{Link.text}</div>
                  </Fade>
                </NavItem>
              </ActiveLink>
            )
          })}
        </ul>
        <ul className="mt-auto">
          <OpenCompilationLogs />
          <NavItem className="link" onClick={onDrawerExpandClick}>
            {isDrawerExpand ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            <Fade in={isDrawerExpand}>
              <div className="ml-6">{t('nav.closePanel')}</div>
            </Fade>
          </NavItem>
        </ul>
      </div>
    </nav>
  )
}

export default PageDrawer
