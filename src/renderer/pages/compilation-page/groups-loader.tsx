/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import AddIcon from '@material-ui/icons/Add'

import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Group } from '../../models'
import classes from './compilation-page.module.scss'

interface Props {
  groups: Group[]
  onChangeGroup: (groupName: string) => void
}

const GroupsLoader: React.FC<Props> = ({ groups, onChangeGroup }) => {
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
    <div className={classes.group}>
      {notEmptyGroups.length > 0 && (
        <>
          <Button
            color="inherit"
            startIcon={<AddIcon />}
            aria-controls="load-group-menu"
            aria-haspopup="true"
            onClick={onClick}
          >
            {t('page.compilation.actions.loadGroup')}
          </Button>

          <Menu
            id="load-group-menu"
            keepMounted
            className={classes.fullWidth}
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

export default GroupsLoader
