import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import Fade from '@material-ui/core/Fade'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
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
      <Fade in={hovering}>
        <Box bgcolor="primary.main" color="inherit" className={classes.scriptHover}>
          <Button aria-label="delete" startIcon={<DeleteIcon />} onClick={onClickRemove}>Remove from list</Button>
        </Box>
      </Fade>
      <Typography variant="body1" component="div">{script.name}</Typography>
      <Typography variant="body2" component="div" className={classes.scriptPath}>
        Last edited at {format(script.lastModified, 'PPpp')}
        <span className={cx([classes.scriptStatus, getClassNameFromStatus(script)])}>
          {getIconFromStatus(script)}
        </span>
      </Typography>
    </Paper>
  )
}

export default ScriptItem