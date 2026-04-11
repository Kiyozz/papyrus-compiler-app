/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { Layout } from '@renderer/pages/layout.tsx'
import { Navigate, Route, Routes as RouterRoutes } from 'react-router'
import { CompilationPage } from './pages/compilation/compilation-page.tsx'
import { GroupsPage } from './pages/groups/groups-page.tsx'
import { SettingsPage } from './pages/settings/settings-page.tsx'

function Routes() {
  return (
    <RouterRoutes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/compilation" replace />} />
        <Route path="/compilation" element={<CompilationPage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route element={<Navigate replace to="/compilation" />} path="*" />
    </RouterRoutes>
  )
}

export { Routes }
