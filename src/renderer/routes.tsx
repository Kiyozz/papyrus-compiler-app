/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { Router, RouteComponentProps } from '@reach/router'
import React from 'react'

import { Groups } from './pages/groups/groups'
import { Compilation } from './pages/index/compilation'
import { Settings } from './pages/settings/settings'

interface Route {
  path: string
  Component: React.FC<RouteComponentProps & unknown>
  default?: boolean
}

const routes: Route[] = [
  { path: '/', Component: Compilation, default: true },
  { path: 'groups', Component: Groups },
  { path: 'settings', Component: Settings }
]

export function Routes(): JSX.Element {
  return (
    <Router className="flex flex-col w-full">
      {routes.map(({ path, Component, default: defaultPage }) => (
        <Component key={path} path={path} default={defaultPage} />
      ))}
    </Router>
  )
}
