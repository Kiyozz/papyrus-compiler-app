/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import { TelemetryEvent } from '../../common/telemetry-event'
import { useApp } from './use-app'
import { useTelemetry } from './use-telemetry'
import type { Group } from '../types'

interface EditGroupParams {
  group: Group
  lastGroupName: string
}

interface UseGroupsReturns {
  add: (group: Group) => void
  edit: (params: EditGroupParams) => void
  remove: (group: Group) => void
}

export const useGroups = (): UseGroupsReturns => {
  const { groups, setConfig } = useApp()
  const { send } = useTelemetry()

  const addGroup = (group: Group) => {
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
      groups: groups.map(g => {
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

  const removeGroup = (group: Group) => {
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
