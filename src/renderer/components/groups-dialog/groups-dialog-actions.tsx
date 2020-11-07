import Button from '@material-ui/core/Button'

import React from 'react'
import { useTranslation } from 'react-i18next'

import classes from './groups-dialog.module.scss'

interface Props {
  name: string
  onClose: () => void
  isEdit: boolean
  AddScriptsButton?: JSX.Element | null
}

const GroupsDialogActions: React.FC<Props> = ({
  name,
  AddScriptsButton,
  onClose,
  isEdit
}) => {
  const { t } = useTranslation()

  return (
    <>
      <div className={classes.auto}>{AddScriptsButton}</div>
      <Button onClick={onClose}>{t('page.groups.dialog.close')}</Button>
      <Button
        type="submit"
        color="primary"
        variant="contained"
        disabled={name === ''}
      >
        {isEdit
          ? t('page.groups.actions.edit')
          : t('page.groups.actions.create')}
      </Button>
    </>
  )
}

export default GroupsDialogActions
