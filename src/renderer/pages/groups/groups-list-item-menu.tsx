/*
 * 2022-2026 Kiyozz.
 */

import { Button } from '@renderer/components/ui/button.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@renderer/components/ui/dropdown-menu.tsx'
import { useTelemetry } from '@renderer/hooks/use-telemetry.tsx'
import { EllipsisIcon, PenIcon, TrashIcon } from 'lucide-react'
import type { MouseEvent } from 'react'
import { Trans } from '@lingui/react/macro'
import { TelemetryEvent } from '../../../common/telemetry-event.ts'

interface GroupsListItemMenuProps {
  onEdit: (evt: MouseEvent<HTMLElement>) => void
  onDelete: (evt: MouseEvent<HTMLElement>) => void
}

function GroupsListItemMenu({ onDelete, onEdit }: GroupsListItemMenuProps) {
  const { send } = useTelemetry()

  const onClickEdit = (evt: MouseEvent<HTMLElement>) => {
    onEdit(evt)
  }

  const onClickDelete = (evt: MouseEvent<HTMLElement>) => {
    send(TelemetryEvent.groupDeleted, {})
    onDelete(evt)
  }

  return (
    <div className="relative self-start">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button size="icon-sm" variant="ghost" className="size-6" />}
        >
          <EllipsisIcon className="size-3.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onClickEdit}>
            <PenIcon />
            <span>
              <Trans>Modifier</Trans>
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onClickDelete}>
            <TrashIcon className="text-destructive" />
            <span>
              <Trans>Supprimer</Trans>
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default GroupsListItemMenu
