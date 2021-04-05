/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import CodeIcon from '@material-ui/icons/Code'
import LayersIcon from '@material-ui/icons/Layers'
import SettingsIcon from '@material-ui/icons/Settings'
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useApp } from '../hooks/use-app'
import { ActiveLink } from './active-link'
import { NavItem } from './nav-item'
import { OpenCompilationLogs } from './open-compilation-logs'

export function PageDrawer(): JSX.Element {
  const { setDrawerOpen, isDrawerExpand, setDrawerExpand } = useApp()
  const { t } = useTranslation()

  const onClick = useCallback(() => setDrawerOpen(false), [setDrawerOpen])

  const links = useMemo(
    () => [
      {
        Icon: CodeIcon,
        text: t('nav.compilation'),
        path: '/compilation'
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

  const onDrawerExpandClick = useCallback(
    () => setDrawerExpand(!isDrawerExpand),
    [setDrawerExpand, isDrawerExpand]
  )

  return (
    <nav
      className={`h-screen-appbar fixed left-0 top-24 ${
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
                activeUnfocusClassName="link-active-unfocus"
                className="link"
                to={Link.path}
                onClick={onClick}
              >
                <NavItem>
                  <Link.Icon />
                  {isDrawerExpand && <div className="ml-6">{Link.text}</div>}
                </NavItem>
              </ActiveLink>
            )
          })}
        </ul>
        <ul className="mt-auto">
          <OpenCompilationLogs />
          <NavItem className="link" onClick={onDrawerExpandClick}>
            {isDrawerExpand ? (
              <>
                <ChevronLeftIcon />
                <div className="ml-6">{t('nav.closePanel')}</div>
              </>
            ) : (
              <ChevronRightIcon />
            )}
          </NavItem>
        </ul>
      </div>
    </nav>
  )
}
