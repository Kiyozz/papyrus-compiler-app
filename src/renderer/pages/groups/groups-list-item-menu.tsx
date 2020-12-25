/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import IconButton from '@material-ui/core/IconButton'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import CreateIcon from '@material-ui/icons/Create'
import DeleteIcon from '@material-ui/icons/Delete'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GroupModel } from '../../models'

interface Props {
  onEdit: () => void
  onDelete: () => void
  group: GroupModel
}

export function GroupsListItemMenu({ group, onDelete, onEdit }: Props) {
  const { t } = useTranslation()
  const [anchorMenu, setAnchorMenu] = useState<HTMLElement | null>(null)
  const menuId = `group-${group.name}`

  const onOpen = useCallback(
    (e: React.MouseEvent<HTMLElement>) => setAnchorMenu(e.currentTarget),
    []
  )
  const onClose = useCallback(() => setAnchorMenu(null), [])

  const onClickEdit = useCallback(() => {
    onClose()
    onEdit()
  }, [onClose, onEdit])

  const onClickDelete = useCallback(() => {
    onClose()
    onDelete()
  }, [onDelete, onClose])

  return (
    <>
      <IconButton onClick={onOpen} aria-controls={menuId} aria-haspopup="true">
        <MoreVertIcon />
      </IconButton>
      <Menu
        id={menuId}
        keepMounted
        onClose={onClose}
        anchorEl={anchorMenu}
        open={anchorMenu !== null}
      >
        <MenuItem onClick={onClickEdit}>
          <ListItemIcon>
            <CreateIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <p>{t('page.groups.actions.edit')}</p>
        </MenuItem>
        <MenuItem onClick={onClickDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <p>{t('page.groups.actions.remove')}</p>
        </MenuItem>
      </Menu>
    </>
  )
}
