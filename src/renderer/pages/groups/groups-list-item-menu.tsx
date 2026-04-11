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
import { useTranslation } from 'react-i18next'
import { TelemetryEvent } from '../../../common/telemetry-event.ts'

interface GroupsListItemMenuProps {
  onEdit: (evt: MouseEvent<HTMLElement>) => void
  onDelete: (evt: MouseEvent<HTMLElement>) => void
}

function GroupsListItemMenu({ onDelete, onEdit }: GroupsListItemMenuProps) {
  const { t } = useTranslation()
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
        <DropdownMenuTrigger asChild>
          <Button size="icon-sm" variant="ghost" className="size-6">
            <EllipsisIcon className="size-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onClickEdit}>
            <PenIcon />
            <span>{t('page.groups.actions.edit')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onClickDelete}>
            <TrashIcon className="text-destructive" />
            <span>{t('page.groups.actions.remove')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default GroupsListItemMenu
