/*
 * 2022-2026 Kiyozz.
 */

import type { Group } from '@renderer/types/index.ts'
import type { MouseEvent, ReactNode } from 'react'
import { Trans } from '@lingui/react/macro'
import GroupsListItemMenu from './groups-list-item-menu'

interface GroupsListItemProps {
  onEdit: (group: Group) => (evt: MouseEvent<HTMLElement>) => void
  onDelete: (group: Group) => (evt: MouseEvent<HTMLElement>) => void
  group: Group
  moreDetails: boolean
}

function GroupsListItem({
  group,
  onDelete,
  onEdit,
  moreDetails,
}: GroupsListItemProps) {
  let secondaryText: ReactNode | undefined

  if (moreDetails) {
    if (group.isEmpty) {
      secondaryText = <Trans>Aucun scripts</Trans>
    } else {
      secondaryText = (
        <ul>
          {group.scripts.map((s) => (
            <li key={`${s.name}-${s.path}`}>
              <span className="text-sm">{s.path}</span>
            </li>
          ))}
        </ul>
      )
    }
  }

  return (
    <li className="flex items-center gap-2 p-1 first:rounded-t-xl last:rounded-b-xl">
      <GroupsListItemMenu onDelete={onDelete(group)} onEdit={onEdit(group)} />
      <div className="flex grow flex-col">
        <span className="text-sm">{group.name}</span>
        {secondaryText && (
          <span className="text-muted-foreground text-sm">{secondaryText}</span>
        )}
      </div>
    </li>
  )
}

export default GroupsListItem
