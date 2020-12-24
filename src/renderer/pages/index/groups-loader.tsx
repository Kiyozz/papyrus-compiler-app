/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import AddIcon from '@material-ui/icons/Add'

import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Group } from '../../models'

interface Props {
  groups: Group[]
  onChangeGroup: (groupName: string) => void
}

export function GroupsLoader({ groups, onChangeGroup }: Props) {
  const { t } = useTranslation()
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => setAnchor(e.currentTarget),
    []
  )
  const onClose = useCallback(() => setAnchor(null), [])

  const groupSelectOptions = useMemo(() => {
    return groups
      .filter(group => !group.isEmpty())
      .map(group => {
        const onClickGroup = () => {
          onClose()
          onChangeGroup(group.name)
        }

        return (
          <MenuItem value={group.name} key={group.name} onClick={onClickGroup}>
            {group.name}
          </MenuItem>
        )
      })
  }, [groups, onChangeGroup, onClose])

  const notEmptyGroups = groups.filter(group => !group.isEmpty())

  return (
    <div className="inline self-center">
      {notEmptyGroups.length > 0 && (
        <>
          <button
            className="btn"
            aria-controls="load-group-menu"
            aria-haspopup="true"
            onClick={onClick}
          >
            <div className="icon">
              <AddIcon />
            </div>
            {t('page.compilation.actions.loadGroup')}
          </button>

          <Menu
            id="load-group-menu"
            keepMounted
            className="w-full"
            open={!!anchor}
            onClose={onClose}
            anchorEl={anchor}
          >
            {groupSelectOptions}
          </Menu>
        </>
      )}
    </div>
  )
}
