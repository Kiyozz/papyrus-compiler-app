import Button from '@material-ui/core/Button'
import Fade from '@material-ui/core/Fade'
import Paper from '@material-ui/core/Paper'
import DeleteIcon from '@material-ui/icons/Delete'

import cx from 'classnames'
import React, { useCallback } from 'react'

import { ScriptModel } from '../../models'
import { format } from '../../utils/date/format'
import getClassNameFromStatus from '../../utils/scripts/get-classname-from-status'
import getIconFromStatus from '../../utils/scripts/get-icon-from-status'
import classes from './compilation-page.module.scss'

interface Props {
  script: ScriptModel
  onMouseEnter: () => void
  onMouseLeave: () => void
  onMouseMove: () => void
  onClickRemoveScript: (script: ScriptModel) => void
  hovering: boolean
}

const ScriptItem: React.FC<Props> = ({ script, onMouseEnter, onMouseLeave, onMouseMove, onClickRemoveScript, hovering }) => {
  const onClickRemove = useCallback(() => {
    onClickRemoveScript(script)
  }, [script, onClickRemoveScript])

  return (
    <Paper
      className={classes.item}
      elevation={hovering ? 4 : 1}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      aria-label="script"
    >
      <Fade
        in={hovering}
        mountOnEnter
        unmountOnExit
      >
        <div className={classes.scriptHover}>
          <Button aria-label="delete" startIcon={<DeleteIcon />} onClick={onClickRemove}>Delete</Button>
        </div>
      </Fade>
      <div className={classes.scriptName}>{script.name}</div>
      <div className={classes.scriptPath}>
        Last edited at {format(script.lastModified, 'PPpp')}
        <span className={cx([classes.scriptStatus, getClassNameFromStatus(script)])}>
          {getIconFromStatus(script)}
        </span>
      </div>
    </Paper>
  )
}

export default ScriptItem
