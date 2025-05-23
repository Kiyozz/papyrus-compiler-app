/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { useTranslation } from 'react-i18next'
import { TelemetryEvent } from '../../../common/telemetry-event.ts'
import { useTelemetry } from '@/hooks/use-telemetry.tsx'
import type { MouseEvent } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx'
import { EllipsisIcon, PenIcon, TrashIcon } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'

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
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon-sm" variant="ghost">
            <EllipsisIcon className="size-4" />
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
