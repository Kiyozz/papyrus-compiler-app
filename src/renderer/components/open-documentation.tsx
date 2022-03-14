/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import HelpIcon from '@mui/icons-material/Help'
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  MOD_DOCUMENTATION_URL,
  MOD_DOCUMENTATION_URL_DEV,
} from '../../common/env'
import { TelemetryEvent } from '../../common/telemetry-event'
import { useBridge } from '../hooks/use-bridge'
import { useDrawer } from '../hooks/use-drawer'
import { useProduction } from '../hooks/use-production'
import { useShowOpenDocumentationDialog } from '../hooks/use-show-open-documentation-dialog'
import { useTelemetry } from '../hooks/use-telemetry'
import Fade from './animations/fade'
import Dialog, { CloseReason } from './dialog/dialog'
import NavItem from './nav-item'

const OpenDocumentation = () => {
  const isProduction = useProduction()
  const [isShowDialog, toggleShowDialog] = useShowOpenDocumentationDialog()
  const { shell } = useBridge()
  const [isDrawerExpand] = useDrawer()
  const { t } = useTranslation()
  const { send } = useTelemetry()
  const [isDialogOpen, setDialogOpen] = useState(false)

  const onClickGoToDocumentation = () => {
    if (isShowDialog) {
      setDialogOpen(true)
    } else {
      openTheDocumentation('click')
    }
  }

  const openTheDocumentation = (reason: 'enter' | 'click') => {
    send(TelemetryEvent.documentationOpenFromNav, { reason })
    shell.openExternal(
      isProduction ? MOD_DOCUMENTATION_URL : MOD_DOCUMENTATION_URL_DEV,
    )
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
        <p className="text-justify mb-4">{t('nav.help.description')}</p>
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
