/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import {
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { ScriptRenderer } from '../../types'
import { iconFromStatus } from '../../utils/scripts/from-status'
import { isRunningScript } from '../../utils/scripts/status'

interface Props {
  script: ScriptRenderer
  onClickRemoveScript: (script: ScriptRenderer) => void
  onClickPlayCompilation: (script: ScriptRenderer) => void
}

const ScriptLine = ({
  script,
  onClickRemoveScript,
  onClickPlayCompilation,
}: Props) => {
  const { t } = useTranslation()

  const onClickRemove = () => {
    onClickRemoveScript(script)
  }

  const onClickPlay = () => {
    onClickPlayCompilation(script)
  }

  const StatusIcon = () => {
    const icon = iconFromStatus(script)

    if (!icon) return null

    return <ListItemIcon>{icon}</ListItemIcon>
  }

  return (
    <ListItem
      component={Paper}
      variant="outlined"
      secondaryAction={
        <IconButton
          color="error"
          aria-label={t('common.remove')}
          disabled={isRunningScript(script)}
          aria-disabled={isRunningScript(script)}
          onClick={onClickRemove}
        >
          <DeleteOutlinedIcon />
        </IconButton>
      }
    >
      <ListItemIcon>
        <IconButton
          onClick={onClickPlay}
          size="small"
          disabled={isRunningScript(script)}
          edge="end"
        >
          <PlayCircleIcon className="text-primary-400" />
        </IconButton>
      </ListItemIcon>
      <ListItemText aria-label={script.name} primary={script.name} />
      <StatusIcon />
    </ListItem>
  )
}

export default ScriptLine
