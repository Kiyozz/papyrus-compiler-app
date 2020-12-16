/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import React from 'react'
import { Router, RouteComponentProps } from '@reach/router'
import { Compilation } from './pages/index/compilation'
import { Groups } from './pages/groups/groups'
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

export function Routes() {
  return (
    <Router>
      {routes.map(({ path, Component, default: defaultPage }) => (
        <Component key={path} path={path} default={defaultPage} />
      ))}
    </Router>
  )
}
