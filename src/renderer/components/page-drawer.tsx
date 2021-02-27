/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import CodeIcon from '@material-ui/icons/Code'
import LayersIcon from '@material-ui/icons/Layers'
import SettingsIcon from '@material-ui/icons/Settings'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useApp } from '../hooks/use-app'
import { OpenCompilationLogs } from './open-compilation-logs'
import { ActiveLink } from './active-link'

export function PageDrawer() {
  const { setDrawerOpen, isDrawerExpand, setDrawerExpand } = useApp()
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

  const onDrawerExpandClick = useCallback(
    () => setDrawerExpand(!isDrawerExpand),
    [setDrawerExpand, isDrawerExpand]
  )

  return (
    <nav
      className={`h-screen-appbar fixed left-0 top-24 ${
        isDrawerExpand ? 'w-48' : 'w-14'
      } bg-black select-none`}
    >
      <div className="h-full flex flex-col">
        <ul className="mt-2 flex flex-col gap-2">
          {links.map(Link => {
            return (
              <ActiveLink
                tabIndex={-1}
                key={Link.path}
                activeClassName="text-white hover:text-white bg-gray-800"
                className="flex hover:no-underline outline-none"
                to={Link.path}
                onClick={onClick}
              >
                <li className="w-full px-4 py-2 flex hover:bg-gray-700 transition-colors">
                  <Link.Icon />
                  {isDrawerExpand && <div className="ml-6">{Link.text}</div>}
                </li>
              </ActiveLink>
            )
          })}
        </ul>
        <ul className="mt-auto">
          <OpenCompilationLogs />
          <li
            className="w-full px-4 py-2 flex hover:bg-gray-700 transition-colors cursor-pointer"
            onClick={onDrawerExpandClick}
          >
            {isDrawerExpand ? (
              <>
                <ChevronLeftIcon />
                <div className="ml-6">{t('nav.closePanel')}</div>
              </>
            ) : (
              <ChevronRightIcon />
            )}
          </li>
        </ul>
      </div>
    </nav>
  )
}
