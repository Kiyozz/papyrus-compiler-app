import Button from '@material-ui/core/Button'

import React from 'react'

import classes from './groups-dialog.module.scss'

interface Props {
  onClose: () => void
  isEdit: boolean
  AddScriptsButton?: JSX.Element | null
}

const GroupsDialogActions: React.FC<Props> = ({ AddScriptsButton, onClose, isEdit }) => {
  return (
    <>
      <div className={classes.auto}>
        {AddScriptsButton}
      </div>
      <Button
        onClick={onClose}
      >
        Close
      </Button>
      <Button
        type="submit"
        color="primary"
        variant="contained"
      >
        {isEdit ? 'Edit' : 'Create'}
      </Button>
    </>
  )
}

export default GroupsDialogActions
