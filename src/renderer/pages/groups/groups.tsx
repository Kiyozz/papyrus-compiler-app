/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import CreateIcon from '@material-ui/icons/Create'
import is from '@sindresorhus/is'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GroupsDialog } from '../../components/groups-dialog/groups-dialog'
import { Page } from '../../components/page/page'
import { PageAppBar } from '../../components/page/page-app-bar'
import { usePageContext } from '../../components/page/page-context'
import { GroupModel } from '../../models'
import { GroupsListItem } from './groups-list-item'

interface EditGroupParams {
  group: GroupModel
  lastGroupName: string
}

export function Groups() {
  const { t } = useTranslation()
  const { groups, updateConfig } = usePageContext()
  const addGroup = useCallback(
    (group: GroupModel) => {
      if (
        !is.undefined(
          groups.find(
            g => g.name.trim().toLowerCase() === group.name.trim().toLowerCase()
          )
        )
      ) {
        return
      }

      updateConfig({
        groups: [
          ...groups,
          {
            name: group.name,
            scripts: group.scripts.map(s => ({ name: s.name, path: s.path }))
          }
        ]
      })
    },
    [updateConfig, groups]
  )
  const editGroup = useCallback(
    ({ group, lastGroupName }: EditGroupParams) => {
      if (
        group.name.trim().toLowerCase() !==
          lastGroupName.trim().toLowerCase() &&
        !is.undefined(
          groups.find(
            g => g.name.trim().toLowerCase() === group.name.trim().toLowerCase()
          )
        )
      ) {
        return
      }

      updateConfig({
        groups: groups.map(g => {
          if (g.name === lastGroupName) {
            return {
              scripts: group.scripts.map(s => ({ name: s.name, path: s.path })),
              name: group.name
            }
          }

          return {
            ...g,
            scripts: g.scripts.map(s => ({ name: s.name, path: s.path }))
          }
        })
      })
    },
    [groups, updateConfig]
  )
  const removeGroup = useCallback(
    (group: GroupModel) => {
      if (
        is.undefined(
          groups.find(
            g => g.name.trim().toLowerCase() === group.name.trim().toLowerCase()
          )
        )
      ) {
        return
      }

      updateConfig(
        {
          groups: groups
            .map(g => ({ name: g.name, scripts: g.scripts }))
            .filter(g => g.name !== group.name)
        },
        true
      )
    },
    [groups, updateConfig]
  )

  const [showAddPopup, setShowPopup] = useState(false)
  const [editingGroup, setEditingGroup] = useState<GroupModel | undefined>()

  const onClickRemoveGroup = useCallback(
    (group: GroupModel) => {
      return () => {
        removeGroup(group)
      }
    },
    [removeGroup]
  )

  const onClickEditGroup = useCallback((group: GroupModel) => {
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
    (group: Partial<GroupModel>) => {
      setShowPopup(false)
      addGroup(group as GroupModel)
    },
    [setShowPopup, addGroup]
  )

  const onGroupEdit = useCallback(
    (lastGroupName: string, group: GroupModel) => {
      setShowPopup(false)
      editGroup({ group, lastGroupName })
    },
    [setShowPopup, editGroup]
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
          </button>
        ]}
      />

      <Page>
        <div>
          <GroupsDialog
            group={editingGroup}
            open={showAddPopup}
            onGroupAdd={onGroupAdd}
            onGroupEdit={onGroupEdit}
            onClose={onClosePopup}
          />

          {groups.length > 0 ? (
            <div className="relative">
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
            <div>
              <p>{t('page.groups.createGroupText')}</p>
              <p>{t('page.groups.whatIsAGroup')}</p>
            </div>
          )}
        </div>
      </Page>
    </>
  )
}
