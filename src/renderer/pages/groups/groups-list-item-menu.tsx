/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import CreateIcon from '@mui/icons-material/Create'
import DeleteIcon from '@mui/icons-material/Delete'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material'
import cx from 'classnames'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TelemetryEvent } from '../../../common/telemetry-event'
import { useDocumentClick } from '../../hooks/use-document-click'
import { useTelemetry } from '../../hooks/use-telemetry'
import { isChildren } from '../../html/is-child'
import type { MouseEvent } from 'react'

interface GroupsListItemMenuProps {
  className?: string
  id: string
  onEdit: (evt: MouseEvent<HTMLElement>) => void
  onDelete: (evt: MouseEvent<HTMLElement>) => void
}

function GroupsListItemMenu({
  className,
  id,
  onDelete,
  onEdit,
}: GroupsListItemMenuProps) {
  const { t } = useTranslation()
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const { send } = useTelemetry()

  useDocumentClick(
    () => setAnchor(null),
    clicked =>
      ((anchor && anchor !== clicked) ?? false) && !isChildren(anchor, clicked),
  )

  const onOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchor(e.currentTarget)
  }

  const onClickEdit = (evt: MouseEvent<HTMLElement>) => {
    setAnchor(null)
    onEdit(evt)
  }

  const onClickDelete = (evt: MouseEvent<HTMLElement>) => {
    send(TelemetryEvent.groupDeleted, {})
    setAnchor(null)
    onDelete(evt)
  }

  return (
    <div className={cx('relative', className)}>
      <IconButton
        aria-controls={anchor ? `${id}-group-button-menu` : undefined}
        aria-expanded={anchor ? 'true' : undefined}
        aria-haspopup="true"
        id={`${id}-group-opener`}
        onClick={onOpen}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        MenuListProps={{
          'aria-labelledby': `${id}-group-opener`,
        }}
        anchorEl={anchor}
        id={`${id}-group-button-menu`}
        open={Boolean(anchor)}
      >
        <MenuItem
          aria-label={t('page.groups.actions.edit')}
          onClick={onClickEdit}
        >
          <ListItemIcon>
            <CreateIcon />
          </ListItemIcon>
          <ListItemText primary={t('page.groups.actions.edit')} />
        </MenuItem>
        <MenuItem
          aria-label={t('page.groups.actions.remove')}
          onClick={onClickDelete}
        >
          <ListItemIcon>
            <DeleteIcon color="error" />
          </ListItemIcon>
          <ListItemText primary={t('page.groups.actions.remove')} />
        </MenuItem>
      </Menu>
    </div>
  )
}

export default GroupsListItemMenu
