/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import CreateIcon from '@mui/icons-material/Create'
import DeleteIcon from '@mui/icons-material/Delete'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import cx from 'classnames'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { TelemetryEvent } from '../../../common/telemetry-event'
import Fade from '../../components/animations/fade'
import { useDocumentClick } from '../../hooks/use-document-click'
import { useTelemetry } from '../../hooks/use-telemetry'
import { isChildren } from '../../html/is-child'

interface Props {
  className?: string
  onEdit: () => void
  onDelete: () => void
}

const GroupsListItemMenu = ({ className, onDelete, onEdit }: Props) => {
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

  const onClickEdit = () => {
    setAnchor(null)
    onEdit()
  }

  const onClickDelete = () => {
    send(TelemetryEvent.groupDeleted, {})
    setAnchor(null)
    onDelete()
  }

  return (
    <div className={cx('relative', className)}>
      <button className="btn-icon" onClick={onOpen} aria-haspopup="true">
        <MoreVertIcon />
      </button>
      <Fade in={!!anchor} timeout={150}>
        <div className="menu absolute top-4 right-4 !z-10">
          <button className="btn btn-justify-start" onClick={onClickEdit}>
            <div className="icon">
              <CreateIcon fontSize="small" color="primary" />
            </div>
            <div className="ml-4">{t('page.groups.actions.edit')}</div>
          </button>
          <button className="btn btn-justify-start" onClick={onClickDelete}>
            <div className="icon">
              <DeleteIcon fontSize="small" color="error" />
            </div>
            <div className="ml-4">{t('page.groups.actions.remove')}</div>
          </button>
        </div>
      </Fade>
    </div>
  )
}

export default GroupsListItemMenu
