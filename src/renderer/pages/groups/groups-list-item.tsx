/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { ListItem, ListItemText, Paper } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import GroupsListItemMenu from './groups-list-item-menu'
import type { Group } from '../../types'
import type { MouseEvent } from 'react';

interface Props {
  onEdit: (group: Group) => (evt: MouseEvent<HTMLElement>) => void
  onDelete: (group: Group) => (evt: MouseEvent<HTMLElement>) => void
  group: Group
  moreDetails: boolean
}

function GroupsListItem({ group, onDelete, onEdit, moreDetails }: Props) {
  const { t } = useTranslation()

  return (
    <ListItem
      className="py-4"
      component={Paper}
      secondaryAction={
        <GroupsListItemMenu
          id={`${group.name}-menu`}
          onDelete={onDelete(group)}
          onEdit={onEdit(group)}
        />
      }
      variant="outlined"
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
