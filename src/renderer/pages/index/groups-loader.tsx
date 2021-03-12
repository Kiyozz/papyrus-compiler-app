/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import AddIcon from '@material-ui/icons/Add'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Group } from '../../interfaces'

interface Props {
  groups: Group[]
  onChangeGroup: (groupName: string) => void
}

export function GroupsLoader({ groups, onChangeGroup }: Props): JSX.Element {
  const { t } = useTranslation()
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)

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
            onClose()
            onChangeGroup(group.name)
          }

          return (
            <button
              className="btn item"
              key={group.name}
              onClick={onClickGroup}
            >
              {group.name}
            </button>
          )

          /*return (
          <MenuItem value={group.name} key={group.name} onClick={onClickGroup}>
            {group.name}
          </MenuItem>
        )*/
        }
      )
  }, [groups, onChangeGroup, onClose])

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
