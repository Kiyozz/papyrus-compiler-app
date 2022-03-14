/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import HelpIcon from '@mui/icons-material/Help'
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useDocumentation } from '../hooks/use-documentation'
import { useDrawer } from '../hooks/use-drawer'
import { useShowOpenDocumentationDialog } from '../hooks/use-show-open-documentation-dialog'
import Fade from './animations/fade'
import Dialog, { CloseReason } from './dialog/dialog'
import NavItem from './nav-item'

const OpenDocumentation = () => {
  const [isShowDialog, toggleShowDialog] = useShowOpenDocumentationDialog()
  const [isDrawerExpand] = useDrawer()
  const { t } = useTranslation()
  const [isDialogOpen, setDialogOpen] = useState(false)
  const { open } = useDocumentation()

  const onClickGoToDocumentation = () => {
    if (isShowDialog) {
      setDialogOpen(true)
    } else {
      openTheDocumentation('click')
    }
  }

  const openTheDocumentation = (reason: 'enter' | 'click') => {
    open(reason)
  }

  const onCloseDialog = (reason?: CloseReason) => {
    if (reason === CloseReason.enter) {
      openTheDocumentation('enter')
    }

    setDialogOpen(false)
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
      <Dialog
        id="documentation"
        open={isDialogOpen}
        maxWidth={70}
        title={t('nav.help.title')}
        onClose={onCloseDialog}
        actions={
          <>
            <button className="btn" onClick={onClickCancel}>
              {t('common.cancel')}
            </button>
            <button className="btn" onClick={onClickConfirmGoToDocumentation}>
              {t('nav.help.goTo')}
            </button>
          </>
        }
      >
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
      </Dialog>
      <NavItem className="link" onClick={onClickGoToDocumentation}>
        <HelpIcon />
        <Fade in={isDrawerExpand}>
          <div className="ml-6">{t('nav.help.text')}</div>
        </Fade>
      </NavItem>
    </>
  )
}

export default OpenDocumentation
