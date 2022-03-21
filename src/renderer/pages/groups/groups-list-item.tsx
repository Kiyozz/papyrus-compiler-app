/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { ListItem, ListItemText, Paper } from '@mui/material'
import React, { MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'

import { Group } from '../../types'
import GroupsListItemMenu from './groups-list-item-menu'

type Props = {
  onEdit: (group: Group) => (evt: MouseEvent<HTMLElement>) => void
  onDelete: (group: Group) => (evt: MouseEvent<HTMLElement>) => void
  group: Group
  moreDetails: boolean
}

const GroupsListItem = ({ group, onDelete, onEdit, moreDetails }: Props) => {
  const { t } = useTranslation()

  return (
    <ListItem
      secondaryAction={
        <GroupsListItemMenu
          id={`${group.name}-menu`}
          onEdit={onEdit(group)}
          onDelete={onDelete(group)}
        />
      }
      component={Paper}
      variant="outlined"
      className="py-4"
    >
      <ListItemText
        primary={group.name}
        secondary={
          moreDetails
            ? group.isEmpty
              ? t('page.groups.noScripts')
              : group.scripts.map(s => s.name).join(', ')
            : undefined
        }
      />
    </ListItem>
  )
}

export default GroupsListItem
