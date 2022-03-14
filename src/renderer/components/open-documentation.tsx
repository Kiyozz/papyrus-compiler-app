/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import HelpIcon from '@mui/icons-material/Help'
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
import { useTelemetry } from '../hooks/use-telemetry'
import Fade from './animations/fade'
import Dialog, { CloseReason } from './dialog/dialog'
import NavItem from './nav-item'

const OpenDocumentation = () => {
  const isProduction = useProduction()
  const { shell } = useBridge()
  const [isDrawerExpand] = useDrawer()
  const { t } = useTranslation()
  const { send } = useTelemetry()
  const [isDialogOpen, setDialogOpen] = useState(false)

  const onClickGoToDocumentation = () => {
    setDialogOpen(true)
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
        <p className="text-justify">{t('nav.help.description')}</p>
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
