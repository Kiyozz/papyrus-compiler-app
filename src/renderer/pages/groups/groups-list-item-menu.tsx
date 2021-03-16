/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import CreateIcon from '@material-ui/icons/Create'
import DeleteIcon from '@material-ui/icons/Delete'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { TelemetryEvents } from '../../../common/telemetry-events'
import { useTelemetry } from '../../hooks/use-telemetry'

interface Props {
  onEdit: () => void
  onDelete: () => void
}

export function GroupsListItemMenu({ onDelete, onEdit }: Props): JSX.Element {
  const { t } = useTranslation()
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const { send } = useTelemetry()

  const onClickOut = useCallback(
    (e: MouseEvent) => {
      const clicked = e.target

      if (anchor && anchor !== clicked) {
        setAnchor(null)
      }
    },
    [anchor]
  )

  useEffect(() => {
    document.addEventListener('click', onClickOut)

    return () => document.removeEventListener('click', onClickOut)
  }, [onClickOut])

  const onOpen = useCallback(
    (e: React.MouseEvent<HTMLElement>) => setAnchor(e.currentTarget),
    []
  )
  const onClose = useCallback(() => setAnchor(null), [])

  const onClickEdit = useCallback(() => {
    onClose()
    onEdit()
  }, [onClose, onEdit])

  const onClickDelete = useCallback(() => {
    send(TelemetryEvents.GroupDeleted, {})
    onClose()
    onDelete()
  }, [onDelete, onClose, send])

  return (
    <div className="relative">
      <button className="btn-icon" onClick={onOpen} aria-haspopup="true">
        <MoreVertIcon />
      </button>
      {anchor !== null && (
        <div className="menu absolute top-4 right-4">
          <button
            className="btn btn-no-rounded btn-justify-between"
            onClick={onClickEdit}
          >
            <div className="icon">
              <CreateIcon fontSize="small" color="primary" />
            </div>
            <div className="ml-4">{t('page.groups.actions.edit')}</div>
          </button>
          <button
            className="btn btn-no-rounded btn-justify-between"
            onClick={onClickDelete}
          >
            <div className="icon">
              <DeleteIcon fontSize="small" color="error" />
            </div>
            <div className="ml-4">{t('page.groups.actions.remove')}</div>
          </button>
        </div>
      )}
    </div>
  )
}
