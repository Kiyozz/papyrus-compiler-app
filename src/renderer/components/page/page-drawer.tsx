/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import CodeIcon from '@material-ui/icons/Code'
import LayersIcon from '@material-ui/icons/Layers'
import SettingsIcon from '@material-ui/icons/Settings'

import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { AppIcon } from '../../assets/logo/vector/app-icon'
import { useStoreSelector } from '../../redux/use-store-selector'
import { OpenCompilationLogs } from '../open-compilation-logs/open-compilation-logs'
import { ActiveLink } from '../active-link/active-link'
import { usePageContext } from './page-context'

export function PageDrawer() {
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

  const version = useStoreSelector(state => state.changelog.version)

  return (
    <nav className="h-screen w-64 select-none">
      <div className="h-full flex flex-col bg-black">
        <div className="h-16 flex items-center justify-center gap-6 app-icon">
          <AppIcon fontSize="large" color="primary" />
          <div className="flex flex-col items-center">
            <h1 className="text-xl font-bold font-nova text-white">PCA</h1>
            <span className="font-harmonia font-medium text-gray-300">
              {version}
            </span>
          </div>
        </div>
        <hr className="h-0.5 border-gray-700" />
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
                  <Link.Icon className="mr-6" />
                  <div>{Link.text}</div>
                </li>
              </ActiveLink>
            )
          })}
        </ul>
        <ul className="mt-auto">
          <OpenCompilationLogs />
        </ul>
      </div>
    </nav>
  )
}
