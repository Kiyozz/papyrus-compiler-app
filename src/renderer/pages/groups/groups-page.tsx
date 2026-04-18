/*
 * 2022-2026 Kiyozz.
 */

import DialogGroupForm from '@renderer/components/dialog/dialog-group.tsx'
import { Button } from '@renderer/components/ui/button.tsx'
import { Label } from '@renderer/components/ui/label.tsx'
import { ScrollArea } from '@renderer/components/ui/scroll-area.tsx'
import { Switch } from '@renderer/components/ui/switch.tsx'
import { LocalStorage } from '@renderer/enums/local-storage.enum.ts'
import { useApp } from '@renderer/hooks/use-app'
import { useGroups } from '@renderer/hooks/use-groups.ts'
import { useTelemetry } from '@renderer/hooks/use-telemetry'
import {
  LayoutHeader,
  LayoutHeaderActions,
  LayoutHeaderTitle,
} from '@renderer/pages/layout.tsx'
import { type Group } from '@renderer/types'
import { PlusIcon } from 'lucide-react'
import { type MouseEvent, useState } from 'react'
import { Trans } from '@lingui/react/macro'
import useLocalStorage from 'react-use-localstorage'
import { TelemetryEvent } from '../../../common/telemetry-event'
import GroupsListItem from './groups-list-item'
import {
  BreadcrumbItem,
  BreadcrumbPage,
} from '@renderer/components/ui/breadcrumb.tsx'

export function GroupsPage() {
  const { send } = useTelemetry()
  const { groups } = useApp()
  const { add, edit, remove } = useGroups()
  const [isMoreDetails, setMoreDetails] = useLocalStorage(
    LocalStorage.groupMoreDetails,
    'false',
  )

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
        <LayoutHeaderTitle>
          <BreadcrumbItem>
            <BreadcrumbPage>
              <Trans>Groupes</Trans>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </LayoutHeaderTitle>
        <LayoutHeaderActions>
          <Button onClick={onClickAddButton} size="icon">
            <PlusIcon />
          </Button>
        </LayoutHeaderActions>
      </LayoutHeader>

      <ScrollArea className="h-(--page-height)">
        <section className="flex h-full flex-col gap-6 p-6">
          <DialogGroupForm
            group={editingGroup}
            onClose={onClosePopup}
            onGroupAdd={onGroupAdd}
            onGroupEdit={onGroupEdit}
            open={isDialogOpen}
          />

          {groups.length > 0 && (
            <div className="flex w-full items-center justify-end">
              <Label htmlFor="more-details" className="pr-2">
                <Trans>Plus de détails</Trans>
              </Label>
              <Switch
                id="more-details"
                checked={isMoreDetails === 'true'}
                onCheckedChange={onChangeMoreDetails}
              />
            </div>
          )}

          {groups.length > 0 ? (
            <ul className="divide-y divide-accent rounded-xl border">
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
              <h5 className="text-xl">
                <Trans>Vous pouvez créer un groupe avec le bouton Créer.</Trans>
              </h5>
              <p>
                <Trans>
                  Un groupe est un ensemble de scripts qui peut être ajoutés
                  rapidement à la compilation.
                </Trans>
              </p>
            </div>
          )}
        </section>
      </ScrollArea>
    </>
  )
}
