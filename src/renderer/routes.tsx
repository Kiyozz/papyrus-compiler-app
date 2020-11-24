/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import React from 'react'
import { Router } from '@reach/router'
import { CompilationPage } from './pages/compilation-page/compilation-page'
import { GroupsPage } from './pages/groups-page/groups-page'
import { SettingsPage } from './pages/settings-page/settings-page'

const routes = [
  { path: '/', Component: CompilationPage, default: true },
  { path: 'groups', Component: GroupsPage },
  { path: 'settings', Component: SettingsPage }
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
