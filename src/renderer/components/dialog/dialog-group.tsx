/*
 * 2022-2026 Kiyozz.
 */

import is from '@sindresorhus/is'
import { SearchIcon, Trash2Icon } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent, KeyboardEvent } from 'react'

import { Button } from '@renderer/components/ui/button.tsx'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@renderer/components/ui/dialog.tsx'
import { Input } from '@renderer/components/ui/input.tsx'
import { ScrollArea } from '@renderer/components/ui/scroll-area.tsx'
import { useDrop, useSetDrop } from '@renderer/hooks/use-drop.tsx'
import { useTelemetry } from '@renderer/hooks/use-telemetry.tsx'
import { Group } from '@renderer/types/index.ts'
import { pscFilesToScript } from '@renderer/utils/scripts/psc-files-to-script.ts'
import { uniqScripts } from '@renderer/utils/scripts/uniq-scripts.ts'
import { TelemetryEvent } from '../../../common/telemetry-event'
import type { Script } from '../../../common/types/script'
import { Trans, useLingui } from '@lingui/react/macro'

interface DialogGroupProps {
  onGroupAdd: (group: Group) => void
  onGroupEdit: (lastGroupName: string, group: Group) => void
  onClose: () => void
  group?: Group
  open: boolean
}

function DialogGroup({
  onGroupAdd,
  onGroupEdit,
  open: isOpen,
  onClose,
  group,
}: DialogGroupProps) {
  const { t } = useLingui()
  const [name, setName] = useState('')
  const [scripts, setScripts] = useState<Script[]>([])
  const [isEdit, setEdit] = useState(false)
  const { send } = useTelemetry()
  const { drop, isFileDialogActive } = useDrop()
  const isValid = is.nonEmptyStringAndNotWhitespace(name)

  const onSubmitGroup = (evt?: FormEvent) => {
    evt?.preventDefault()

    if (!isValid) {
      return
    }

    if (isEdit && group) {
      onGroupEdit(group.name, new Group(name.trim(), scripts))

      return
    }

    onGroupAdd(new Group(name.trim(), scripts))
  }

  const onDialogKeyDown = (evt: KeyboardEvent) => {
    if (evt.key === 'Enter' && isValid) {
      send(TelemetryEvent.groupCloseWithEnter, {})
      onSubmitGroup()
    }
  }

  useEffect(() => {
    if (isOpen) {
      if (!group) {
        setName('')
        setScripts([])
        setEdit(false)

        return
      }

      setName(group.name)
      setScripts(group.scripts)
      setEdit(true)
    }
  }, [isOpen, group])

  const onClickRemoveScriptFromGroup = (script: Script) => {
    return () => {
      setScripts((s) =>
        s.filter((scriptFromList) => scriptFromList.name !== script.name),
      )
    }
  }

  const onChangeName = (evt: ChangeEvent<HTMLInputElement>) => {
    const value = evt.currentTarget.value

    if (is.string(value)) {
      setName(value)
    }
  }

  const onDrop = useCallback(
    (pscFiles: File[]) => {
      const pscScripts = pscFilesToScript(pscFiles)

      send(TelemetryEvent.groupDropScripts, { scripts: pscScripts.length })
      setScripts((s) => uniqScripts([...s, ...pscScripts]))
    },
    [send],
  )

  useSetDrop(onDrop)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="flex flex-col px-0"
        aria-describedby={undefined}
      >
        <form
          className="flex h-full flex-col gap-4"
          onSubmit={onSubmitGroup}
          onKeyDown={onDialogKeyDown}
        >
          <DialogHeader className="px-6">
            <DialogTitle>Group</DialogTitle>
          </DialogHeader>

          <div className="px-6">
            <Input
              id="group-name"
              name="group-name"
              onChange={onChangeName}
              placeholder={t`Nom`}
              value={name}
              className="no-drag"
            />
          </div>

          {scripts.length > 0 ? (
            <ScrollArea className="w-full h-96">
              <div className="px-6">
                <ul className="divide-y divide-accent rounded-xl border">
                  {scripts.map((script) => (
                    <li
                      key={script.name}
                      className="flex items-center gap-2 p-1 first:rounded-t-xl last:rounded-b-xl hover:bg-accent/75"
                    >
                      <span className="grow text-sm">{script.name}</span>
                      <Button
                        variant="destructive"
                        size="icon-sm"
                        aria-label={t`Retirer`}
                        onClick={onClickRemoveScriptFromGroup(script)}
                        className="size-6"
                      >
                        <Trash2Icon className="size-3.5" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollArea>
          ) : (
            <div className="flex grow items-center justify-center">
              <Trans>Glisser-déposer vos scripts ici</Trans>
            </div>
          )}

          <DialogFooter className="px-6">
            <Button
              aria-disabled={isFileDialogActive}
              className="mr-auto"
              disabled={isFileDialogActive}
              onClick={drop}
              variant="outline"
              size="icon"
            >
              <SearchIcon />
            </Button>
            <Button variant="outline" onClick={onClose}>
              <Trans>Annuler</Trans>
            </Button>
            <Button aria-disabled={!isValid} disabled={!isValid} type="submit">
              {isEdit ? <Trans>Modifier</Trans> : <Trans>Créer</Trans>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default DialogGroup
