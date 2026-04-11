/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { useTranslation } from 'react-i18next'
import { TelemetryEvent } from '../../../common/telemetry-event'
import { useTelemetry } from '@renderer/hooks/use-telemetry.tsx'
import type { Group } from '@renderer/types/index.ts'
import { Button } from '@renderer/components/ui/button.tsx'
import { PlusIcon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@renderer/components/ui/dropdown-menu.tsx'
import { toast } from 'sonner'

interface GroupsMenuProps {
  groups: Group[]
  onChangeGroup: (groupName: string) => void
}

function GroupsMenu({ groups, onChangeGroup }: GroupsMenuProps) {
  const { t } = useTranslation()
  const { send } = useTelemetry()

  const notEmptyGroups = groups.filter(
    (group: Group): boolean => !group.isEmpty,
  )

  return (
    <div>
      {notEmptyGroups.length > 0 && (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <PlusIcon />
                <span>{t('page.compilation.actions.group')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {groups
                .filter((group: Group): boolean => !group.isEmpty)
                .map((group) => {
                  const onClickGroup = () => {
                    send(TelemetryEvent.compilationGroupLoaded, {
                      groups: groups.length,
                    })
                    toast.info(
                      `${group.scripts.length} scripts loaded from ${group.name}`,
                    )
                    onChangeGroup(group.name)
                  }

                  return (
                    <DropdownMenuItem key={group.name} onClick={onClickGroup}>
                      {group.name}
                    </DropdownMenuItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </div>
  )
}

export default GroupsMenu
