/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'

import { TelemetryEvent } from '../../common/telemetry-event'
import { Group, GroupRenderer } from '../types'
import { useApp } from './use-app'
import { useTelemetry } from './use-telemetry'

type EditGroupParams = {
  group: GroupRenderer
  lastGroupName: string
}

type UseGroupsReturns = {
  add: (group: GroupRenderer) => void
  edit: (params: EditGroupParams) => void
  remove: (group: GroupRenderer) => void
}

export const useGroups = (): UseGroupsReturns => {
  const { groups, setConfig } = useApp()
  const { send } = useTelemetry()

  const addGroup = (group: GroupRenderer) => {
    if (
      !is.undefined(
        groups.find(
          g => g.name.trim().toLowerCase() === group.name.trim().toLowerCase(),
        ),
      )
    ) {
      return
    }

    send(TelemetryEvent.groupCreated, { scripts: group.scripts.length })
    setConfig({
      groups: [
        ...groups,
        {
          name: group.name,
          scripts: group.scripts.map(s => ({ name: s.name, path: s.path })),
        },
      ],
    })
  }

  const editGroup = ({ group, lastGroupName }: EditGroupParams) => {
    if (
      group.name.trim().toLowerCase() !== lastGroupName.trim().toLowerCase() &&
      !is.undefined(
        groups.find(
          g => g.name.trim().toLowerCase() === group.name.trim().toLowerCase(),
        ),
      )
    ) {
      return
    }

    send(TelemetryEvent.groupEdited, { scripts: group.scripts.length })
    setConfig({
      groups: groups.map((g: Group) => {
        if (g.name === lastGroupName) {
          return {
            scripts: group.scripts.map(s => ({ name: s.name, path: s.path })),
            name: group.name,
          }
        }

        return {
          ...g,
          scripts: g.scripts.map(s => ({ name: s.name, path: s.path })),
        }
      }),
    })
  }

  const removeGroup = (group: GroupRenderer) => {
    if (
      is.undefined(
        groups.find(
          g => g.name.trim().toLowerCase() === group.name.trim().toLowerCase(),
        ),
      )
    ) {
      return
    }

    setConfig(
      {
        groups: groups
          .map(g => ({ name: g.name, scripts: g.scripts }))
          .filter(g => g.name !== group.name),
      },
      true,
    )
  }

  return {
    add: addGroup,
    edit: editGroup,
    remove: removeGroup,
  }
}
