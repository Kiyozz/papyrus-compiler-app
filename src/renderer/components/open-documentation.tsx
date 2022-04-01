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
  Typography,
} from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDocumentation } from '../hooks/use-documentation'
import { useShowOpenDocumentationDialog } from '../hooks/use-show-open-documentation-dialog'
import DrawerButton from './drawer-button'
import type { KeyboardEvent } from 'react'

function OpenDocumentation() {
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
        onClick={onClickGoToDocumentation}
        text={t('nav.help.text')}
      />

      <Dialog
        aria-describedby="open-doc-content"
        aria-labelledby="open-doc-title"
        onClose={onCloseDialog}
        onKeyDown={onDialogKeyDown}
        open={isDialogOpen}
      >
        <DialogTitle id="open-doc-title">{t('nav.help.title')}</DialogTitle>
        <DialogContent id="open-doc-content">
          <Typography className="text-justify" gutterBottom>
            {t('nav.help.description')}
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!isShowDialog}
                  inputProps={{ 'aria-label': 'controlled' }}
                  onChange={toggleShowDialog}
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
