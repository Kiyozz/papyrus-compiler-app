/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import AddIcon from '@material-ui/icons/Add'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { TelemetryEvents } from '../../../common/telemetry-events'
import { useDocumentClick } from '../../hooks/use-document-click'
import { useTelemetry } from '../../hooks/use-telemetry'
import { isChildren } from '../../html/is-child'
import { Group } from '../../interfaces'

interface Props {
  groups: Group[]
  onChangeGroup: (groupName: string) => void
}

export function GroupsLoader({ groups, onChangeGroup }: Props): JSX.Element {
  const { t } = useTranslation()
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const { send } = useTelemetry()

  useDocumentClick(
    () => {
      setAnchor(null)
    },
    clicked =>
      ((anchor && clicked !== anchor) ?? false) && !isChildren(anchor, clicked)
  )

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchor(e.currentTarget)
  }

  const groupSelectOptions = useMemo(() => {
    return groups
      .filter((group: Group): boolean => !group.isEmpty())
      .map(
        (group: Group): JSX.Element => {
          const onClickGroup = () => {
            send(TelemetryEvents.CompilationGroupLoaded, {
              groups: groups.length
            })
            setAnchor(null)
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
  }, [groups, onChangeGroup, send])

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
