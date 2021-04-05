/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import { Groups } from './pages/groups/groups'
import { Compilation } from './pages/index/compilation'
import { Settings } from './pages/settings/settings'

export function Routes(): JSX.Element {
  return (
    <div className="flex flex-col w-full">
      <Switch>
        <Route path="/compilation" exact component={Compilation} />
        <Route path="/groups" component={Groups} />
        <Route path="/settings" component={Settings} />
        <Redirect to="/compilation" />
      </Switch>
    </div>
  )
}
