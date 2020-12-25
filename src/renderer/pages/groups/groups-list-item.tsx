/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import React from 'react'
import { useTranslation } from 'react-i18next'

import { Group, GroupModel } from '../../models'
import { GroupsListItemMenu } from './groups-list-item-menu'

interface Props {
  onEdit: (group: GroupModel) => () => void
  onDelete: (group: GroupModel) => () => void
  group: Group
}

export function GroupsListItem({ group, onDelete, onEdit }: Props) {
  const { t } = useTranslation()

  return (
    <div key={group.name} className="relative paper">
      <div className="absolute top-1 right-1">
        <GroupsListItemMenu
          onEdit={onEdit(group)}
          onDelete={onDelete(group)}
          group={group}
        />
      </div>
      <div>{group.name}</div>
      <div className="text-sm italic">
        {!group.isEmpty() ? (
          <>
            {group.scripts
              .slice(0, 3)
              .map(script => script.name)
              .join(', ')}
            {group.scripts.length > 3 ? ', ...' : ''}
          </>
        ) : (
          <>{t('page.groups.noScripts')}</>
        )}
      </div>
    </div>
  )
}
