/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import React from 'react'
import { Navigate, Route, Routes as RouterRoutes } from 'react-router-dom'

import Groups from './pages/groups/groups'
import Compilation from './pages/index'
import Settings from './pages/settings/settings'

const Routes = () => (
  <div className="flex w-full flex-col">
    <RouterRoutes>
      <Route path="/compilation" element={<Compilation />} />
      <Route path="/groups/*" element={<Groups />} />
      <Route path="/settings/*" element={<Settings />} />
      <Route path="*" element={<Navigate to="/compilation" replace />} />
    </RouterRoutes>
  </div>
)

export default Routes
