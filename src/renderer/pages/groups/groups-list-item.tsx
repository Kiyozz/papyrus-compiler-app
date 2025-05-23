/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import type { Group } from '@/types/index.ts'
import type { MouseEvent, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import GroupsListItemMenu from './groups-list-item-menu'

interface GroupsListItemProps {
  onEdit: (group: Group) => (evt: MouseEvent<HTMLElement>) => void
  onDelete: (group: Group) => (evt: MouseEvent<HTMLElement>) => void
  group: Group
  moreDetails: boolean
}

function GroupsListItem({ group, onDelete, onEdit, moreDetails }: GroupsListItemProps) {
  const { t } = useTranslation()

  let secondaryText: ReactNode | undefined

  if (moreDetails) {
    if (group.isEmpty) {
      secondaryText = t('page.groups.noScripts')
    } else {
      secondaryText = (
        <ul>
          {group.scripts.map((s) => (
            <li key={`${s.name}-${s.path}`}>
              <span className="text-sm">{s.name}</span>
            </li>
          ))}
        </ul>
      )
    }
  }

  return (
    <li className="flex items-center gap-2 px-2 py-1 first:rounded-t-md last:rounded-b-md">
      <p className="flex grow flex-col">
        <span className="text-sm">{group.name}</span>
        {secondaryText && <span className="text-muted-foreground text-sm">{secondaryText}</span>}
      </p>
      <GroupsListItemMenu onDelete={onDelete(group)} onEdit={onEdit(group)} />
    </li>
  )
}

export default GroupsListItem
