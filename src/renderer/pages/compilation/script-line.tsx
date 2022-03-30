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
import { iconFromStatus } from '../../utils/scripts/from-status'
import { isRunningScript } from '../../utils/scripts/status'
import type { ScriptRenderer } from '../../types'

interface Props {
  script: ScriptRenderer
  onClickRemoveScript: (script: ScriptRenderer) => void
  onClickPlayCompilation: (script: ScriptRenderer) => void
}

function ScriptLine({
  script,
  onClickRemoveScript,
  onClickPlayCompilation,
}: Props) {
  const { t } = useTranslation()

  const onClickRemove = () => {
    onClickRemoveScript(script)
  }

  const onClickPlay = () => {
    onClickPlayCompilation(script)
  }

  function StatusIcon() {
    const icon = iconFromStatus(script)

    if (!icon) return null

    return <ListItemIcon>{icon}</ListItemIcon>
  }

  return (
    <ListItem
      component={Paper}
      secondaryAction={
        <IconButton
          aria-disabled={isRunningScript(script)}
          aria-label={t('common.remove')}
          color="error"
          disabled={isRunningScript(script)}
          onClick={onClickRemove}
        >
          <DeleteOutlinedIcon />
        </IconButton>
      }
      variant="outlined"
    >
      <ListItemIcon>
        <IconButton
          disabled={isRunningScript(script)}
          edge="end"
          onClick={onClickPlay}
          size="small"
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
