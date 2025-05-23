/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import DialogGroup from '@/components/dialog/dialog-group.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Label } from '@/components/ui/label.tsx'
import { Switch } from '@/components/ui/switch.tsx'
import { LocalStorage } from '@/enums/local-storage.enum.ts'
import { useApp } from '@/hooks/use-app'
import { useGroups } from '@/hooks/use-groups.ts'
import { useTelemetry } from '@/hooks/use-telemetry'
import { LayoutHeader, LayoutHeaderTitle } from '@/pages/layout.tsx'
import { type Group } from '@/types'
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'
import type { MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import useLocalStorage from 'react-use-localstorage'
import { TelemetryEvent } from '../../../common/telemetry-event'
import GroupsListItem from './groups-list-item'

export function GroupsPage() {
  const { send } = useTelemetry()
  const { t } = useTranslation()
  const { groups } = useApp()
  const { add, edit, remove } = useGroups()
  const [isMoreDetails, setMoreDetails] = useLocalStorage(LocalStorage.groupMoreDetails, 'false')

  const [isDialogOpen, setDialogOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<Group | undefined>()

  const onClickRemoveGroup = (group: Group) => {
    return (evt: MouseEvent<HTMLElement>) => {
      evt.currentTarget.blur()

      remove(group)
    }
  }

  const onClickEditGroup = (group: Group) => {
    return (evt: MouseEvent<HTMLElement>) => {
      evt.currentTarget.blur()

      setEditingGroup(group)
      setDialogOpen(true)
    }
  }

  const onClickAddButton = (evt: MouseEvent<HTMLElement>) => {
    evt.currentTarget.blur()

    setEditingGroup(undefined)
    setDialogOpen(true)
  }

  const onGroupAdd = (group: Group) => {
    setDialogOpen(false)
    add(group)
  }

  const onGroupEdit = (lastGroupName: string, group: Group) => {
    setDialogOpen(false)
    edit({ group, lastGroupName })
  }

  const onClosePopup = () => {
    setDialogOpen(false)
  }

  const onChangeMoreDetails = (checked: boolean) => {
    send(TelemetryEvent.groupMoreDetails, {
      moreDetails: checked,
    })
    setMoreDetails(checked ? 'true' : 'false')
  }

  return (
    <>
      <LayoutHeader>
        <LayoutHeaderTitle>{t('page.groups.title')}</LayoutHeaderTitle>
        <Button onClick={onClickAddButton} size="icon">
          <PlusIcon />
        </Button>
      </LayoutHeader>

      <section className="flex grow flex-col gap-6 p-6">
        <DialogGroup
          group={editingGroup}
          onClose={onClosePopup}
          onGroupAdd={onGroupAdd}
          onGroupEdit={onGroupEdit}
          open={isDialogOpen}
        />

        {groups.length > 0 && (
          <div className="flex w-full items-center justify-end">
            <Label htmlFor="more-details" className="pr-2">
              {t('common.moreDetails')}
            </Label>
            <Switch id="more-details" checked={isMoreDetails === 'true'} onCheckedChange={onChangeMoreDetails} />
          </div>
        )}

        {groups.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {groups.map((group) => (
              <GroupsListItem
                group={group}
                key={group.name}
                moreDetails={isMoreDetails === 'true'}
                onDelete={onClickRemoveGroup}
                onEdit={onClickEditGroup}
              />
            ))}
          </ul>
        ) : (
          <div className="h-full w-full justify-center gap-4 text-lg">
            <h5 className="text-xl">{t('page.groups.createGroupText')}</h5>
            <p>{t('page.groups.whatIsAGroup')}</p>
          </div>
        )}
      </section>
    </>
  )
}
