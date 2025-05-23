/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import type { MouseEvent, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { Group } from '@/types/index.ts'
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
      secondaryText = group.scripts.map((s) => s.name).join(', ')
    }
  }

  return (
    <li className="flex items-center rounded-md border p-4">
      <p className="flex grow flex-col">
        <span className="text-lg">{group.name}</span>
        {secondaryText && <span className="text-muted-foreground text-sm">{secondaryText}</span>}
      </p>
      <GroupsListItemMenu onDelete={onDelete(group)} onEdit={onEdit(group)} />
    </li>
  )
}

export default GroupsListItem
