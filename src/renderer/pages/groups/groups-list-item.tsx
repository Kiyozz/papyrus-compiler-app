/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import React from 'react'
import { useTranslation } from 'react-i18next'

import { Group, GroupInterface } from '../../interfaces'
import { GroupsListItemMenu } from './groups-list-item-menu'

interface Props {
  onEdit: (group: GroupInterface) => () => void
  onDelete: (group: GroupInterface) => () => void
  group: Group
}

export function GroupsListItem({
  group,
  onDelete,
  onEdit
}: Props): JSX.Element {
  const { t } = useTranslation()

  return (
    <div className="paper flex items-center">
      <div className="w-full">
        <div className="text-black-800 dark:text-white">{group.name}</div>
        <div className="text-xs pl-2 text-black-400 dark:text-white">
          {!group.isEmpty() ? (
            <>
              {group.scripts
                .slice(0, 5)
                .map(script => script.name)
                .join(', ')}
              {group.scripts.length > 3 ? ', ...' : ''}
            </>
          ) : (
            <>{t('page.groups.noScripts')}</>
          )}
        </div>
      </div>
      <GroupsListItemMenu onEdit={onEdit(group)} onDelete={onDelete(group)} />
    </div>
  )
}
