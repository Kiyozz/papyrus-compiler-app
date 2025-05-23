/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { Layout } from '@/pages/layout.tsx'
import { Navigate, Route, Routes as RouterRoutes } from 'react-router-dom'
import { CompilationPage } from './pages/compilation/compilation-page.tsx'
import { GroupsPage } from './pages/groups/groups-page.tsx'
import { SettingsPage } from './pages/settings/settings-page.tsx'

function Routes() {
  return (
    <RouterRoutes>
      <Route element={<Layout />}>
        <Route index element={<CompilationPage />} path="/compilation" />
        <Route element={<GroupsPage />} path="/groups" />
        <Route element={<SettingsPage />} path="/settings" />
      </Route>
      <Route element={<Navigate replace to="/compilation" />} path="*" />
    </RouterRoutes>
  )
}

export default Routes
