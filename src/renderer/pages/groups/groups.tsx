/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import CreateIcon from '@material-ui/icons/Create'
import is from '@sindresorhus/is'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { TelemetryEvents } from '../../../common/telemetry-events'
import { GroupsDialog } from '../../components/groups/groups-dialog'
import { Page } from '../../components/page'
import { PageAppBar } from '../../components/page-app-bar'
import { useApp } from '../../hooks/use-app'
import { useTelemetry } from '../../hooks/use-telemetry'
import { Group, GroupInterface } from '../../interfaces'
import { GroupsListItem } from './groups-list-item'

interface EditGroupParams {
  group: GroupInterface
  lastGroupName: string
}

export function Groups(): JSX.Element {
  const { t } = useTranslation()
  const { groups, setConfig } = useApp()
  const { send } = useTelemetry()

  const [showAddPopup, setShowPopup] = useState(false)
  const [editingGroup, setEditingGroup] = useState<GroupInterface | undefined>()

  const addGroup = useCallback(
    (group: GroupInterface) => {
      if (
        !is.undefined(
          groups.find(
            g =>
              g.name.trim().toLowerCase() === group.name.trim().toLowerCase(),
          ),
        )
      ) {
        return
      }

      send(TelemetryEvents.groupCreated, { scripts: group.scripts.length })
      setConfig({
        groups: [
          ...groups,
          {
            name: group.name,
            scripts: group.scripts.map(s => ({ name: s.name, path: s.path })),
          },
        ],
      })
    },
    [setConfig, groups, send],
  )
  const editGroup = useCallback(
    ({ group, lastGroupName }: EditGroupParams) => {
      if (
        group.name.trim().toLowerCase() !==
          lastGroupName.trim().toLowerCase() &&
        !is.undefined(
          groups.find(
            g =>
              g.name.trim().toLowerCase() === group.name.trim().toLowerCase(),
          ),
        )
      ) {
        return
      }

      send(TelemetryEvents.groupEdited, { scripts: group.scripts.length })
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
    },
    [groups, setConfig, send],
  )
  const removeGroup = useCallback(
    (group: GroupInterface) => {
      if (
        is.undefined(
          groups.find(
            g =>
              g.name.trim().toLowerCase() === group.name.trim().toLowerCase(),
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
    },
    [groups, setConfig],
  )

  const onClickRemoveGroup = useCallback(
    (group: GroupInterface) => {
      return () => {
        removeGroup(group)
      }
    },
    [removeGroup],
  )

  const onClickEditGroup = useCallback((group: GroupInterface) => {
    return () => {
      setEditingGroup(group)
      setShowPopup(true)
    }
  }, [])

  const onClickAddButton = useCallback(() => {
    setEditingGroup(undefined)
    setShowPopup(true)
  }, [])

  const onGroupAdd = useCallback(
    (group: Partial<GroupInterface>) => {
      setShowPopup(false)
      addGroup(group as GroupInterface)
    },
    [setShowPopup, addGroup],
  )

  const onGroupEdit = useCallback(
    (lastGroupName: string, group: GroupInterface) => {
      setShowPopup(false)
      editGroup({ group, lastGroupName })
    },
    [setShowPopup, editGroup],
  )

  const onClosePopup = useCallback(() => {
    setShowPopup(false)
  }, [])

  return (
    <>
      <PageAppBar
        title={t('page.groups.title')}
        actions={[
          <button key={1} className="btn" onClick={onClickAddButton}>
            <div className="icon">
              <CreateIcon />
            </div>
            {t('page.groups.actions.create')}
          </button>,
        ]}
      />

      <Page mainClassName="h-full">
        <>
          <GroupsDialog
            group={editingGroup}
            open={showAddPopup}
            onGroupAdd={onGroupAdd}
            onGroupEdit={onGroupEdit}
            onClose={onClosePopup}
          />

          {groups.length > 0 ? (
            <div className="relative flex flex-col gap-2">
              {groups.map(group => {
                return (
                  <GroupsListItem
                    onDelete={onClickRemoveGroup}
                    onEdit={onClickEditGroup}
                    group={group}
                    key={group.name}
                  />
                )
              })}
            </div>
          ) : (
            <div className="h-full w-full flex flex-col items-center text-center gap-4 justify-center text-lg">
              <p className="text-black-600 dark:text-white font-medium">
                {t('page.groups.createGroupText')}
              </p>
              <p>{t('page.groups.whatIsAGroup')}</p>
            </div>
          )}
        </>
      </Page>
    </>
  )
}
