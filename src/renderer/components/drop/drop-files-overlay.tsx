/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { Dialog, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
  open: boolean
}

const DropFilesOverlay = ({ open }: Props) => {
  const { t } = useTranslation()

  return (
    <Dialog open={open} className="pointer-events-none">
      <Typography variant="h2" className="p-16">
        {t('common.drop')}
      </Typography>
    </Dialog>
  )
}

export default DropFilesOverlay
