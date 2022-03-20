/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import HelpIcon from '@mui/icons-material/Help'
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
} from '@mui/material'
import React, { useState, KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'

import { useDocumentation } from '../hooks/use-documentation'
import { useShowOpenDocumentationDialog } from '../hooks/use-show-open-documentation-dialog'
import DrawerButton from './drawer-button'

const OpenDocumentation = () => {
  const [isShowDialog, toggleShowDialog] = useShowOpenDocumentationDialog()
  const { t } = useTranslation()
  const [isDialogOpen, setDialogOpen] = useState(false)
  const { open } = useDocumentation()

  const openTheDocumentation = (reason: 'enter' | 'click') => {
    open(reason)
  }

  const onClickGoToDocumentation = () => {
    if (isShowDialog) {
      setDialogOpen(true)
    } else {
      openTheDocumentation('click')
    }
  }

  const onCloseDialog = () => {
    setDialogOpen(false)
  }

  const onDialogKeyDown = (evt: KeyboardEvent) => {
    if (evt.key === 'Enter') {
      openTheDocumentation('enter')
      setDialogOpen(false)
    }
  }

  const onClickCancel = () => {
    onCloseDialog()
  }

  const onClickConfirmGoToDocumentation = () => {
    openTheDocumentation('click')
    setDialogOpen(false)
  }

  return (
    <>
      <DrawerButton
        icon={<HelpIcon />}
        text={t('nav.help.text')}
        onClick={onClickGoToDocumentation}
      />

      <Dialog
        open={isDialogOpen}
        onClose={onCloseDialog}
        onKeyDown={onDialogKeyDown}
        aria-labelledby="open-doc-title"
        aria-describedby="open-doc-content"
      >
        <DialogTitle id="open-doc-title">{t('nav.help.title')}</DialogTitle>
        <DialogContent id="open-doc-content">
          <p className="mb-4 text-justify">{t('nav.help.description')}</p>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!isShowDialog}
                  onChange={toggleShowDialog}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              label={t<string>('nav.help.doNotShowAgain')}
            />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClickCancel}>{t('common.no')}</Button>
          <Button onClick={onClickConfirmGoToDocumentation}>
            {t('common.yes')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default OpenDocumentation
