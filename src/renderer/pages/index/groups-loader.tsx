/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import AddIcon from '@material-ui/icons/Add'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { TelemetryEvents } from '../../../common/telemetry-events'
import { useTelemetry } from '../../hooks/use-telemetry'
import { Group } from '../../interfaces'

interface Props {
  groups: Group[]
  onChangeGroup: (groupName: string) => void
}

export function GroupsLoader({ groups, onChangeGroup }: Props): JSX.Element {
  const { t } = useTranslation()
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const { send } = useTelemetry()

  const onClickOut = useCallback(
    (e: MouseEvent) => {
      const clicked = e.target

      if (anchor) {
        if (anchor !== clicked) {
          setAnchor(null)
        }
      }
    },
    [anchor]
  )

  useEffect(() => {
    document.addEventListener('click', onClickOut)

    return () => document.removeEventListener('click', onClickOut)
  }, [onClickOut])

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => setAnchor(e.currentTarget),
    []
  )
  const onClose = useCallback(() => setAnchor(null), [])

  const groupSelectOptions = useMemo(() => {
    return groups
      .filter((group: Group): boolean => !group.isEmpty())
      .map(
        (group: Group): JSX.Element => {
          const onClickGroup = () => {
            send(TelemetryEvents.CompilationGroupLoaded, {
              groups: groups.length
            })
            onClose()
            onChangeGroup(group.name)
          }

          return (
            <button
              className="btn item btn-no-rounded"
              key={group.name}
              onClick={onClickGroup}
            >
              {group.name}
            </button>
          )
        }
      )
  }, [groups, onChangeGroup, onClose, send])

  const notEmptyGroups = groups.filter(
    (group: Group): boolean => !group.isEmpty()
  )

  return (
    <div className="inline self-center relative">
      {notEmptyGroups.length > 0 && (
        <>
          <button className="btn" aria-haspopup="true" onClick={onClick}>
            <div className="icon">
              <AddIcon />
            </div>
            {t('page.compilation.actions.loadGroup')}
          </button>

          {anchor && (
            <div className="menu absolute top-4 -left-4">
              {groupSelectOptions}
            </div>
          )}
        </>
      )}
    </div>
  )
}
