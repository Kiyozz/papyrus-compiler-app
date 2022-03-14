/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import CreateIcon from '@mui/icons-material/Create'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import GroupsDialog from '../../components/groups/groups-dialog'
import Page from '../../components/page'
import PageAppBar from '../../components/page-app-bar'
import { useApp } from '../../hooks/use-app'
import { useGroups } from '../../hooks/use-groups'
import { GroupRenderer } from '../../types'
import GroupsListItem from './groups-list-item'

const Groups = () => {
  const { t } = useTranslation()
  const { groups } = useApp()
  const { add, edit, remove } = useGroups()

  const [showAddPopup, setShowPopup] = useState(false)
  const [editingGroup, setEditingGroup] = useState<GroupRenderer | undefined>()

  const onClickRemoveGroup = (group: GroupRenderer) => {
    return () => {
      remove(group)
    }
  }

  const onClickEditGroup = (group: GroupRenderer) => {
    return () => {
      setEditingGroup(group)
      setShowPopup(true)
    }
  }

  const onClickAddButton = () => {
    setEditingGroup(undefined)
    setShowPopup(true)
  }

  const onGroupAdd = (group: GroupRenderer) => {
    setShowPopup(false)
    add(group)
  }

  const onGroupEdit = (lastGroupName: string, group: GroupRenderer) => {
    setShowPopup(false)
    edit({ group, lastGroupName })
  }

  const onClosePopup = () => {
    setShowPopup(false)
  }

  return (
    <>
      <PageAppBar
        title={t('page.groups.title')}
        actions={
          <button className="btn" onClick={onClickAddButton}>
            <div className="icon">
              <CreateIcon />
            </div>
            {t('page.groups.actions.create')}
          </button>
        }
      />

      <Page mainClassName="h-full">
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
          <div className="h-full w-full justify-center gap-4 text-lg">
            <p className="font-medium text-black-600 dark:text-white">
              {t('page.groups.createGroupText')}
            </p>
            <p>{t('page.groups.whatIsAGroup')}</p>
          </div>
        )}
      </Page>
    </>
  )
}

export default Groups
