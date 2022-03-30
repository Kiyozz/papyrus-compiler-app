/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { Paper, Typography } from '@mui/material'
import is from '@sindresorhus/is'
import cx from 'classnames'
import React from 'react'
import type { PropsWithChildren, ReactNode } from 'react'

interface SettingsSectionProps {
  title: ReactNode
  className?: string
  titleId?: string
  id?: string
  gutterTop?: boolean
  'aria-label'?: string
}

function SettingsSection({
  title,
  className,
  id,
  gutterTop = true,
  'aria-label': ariaLabel,
  titleId,
  children,
}: PropsWithChildren<SettingsSectionProps>) {
  return (
    <Paper
      aria-label={is.string(title) ? title : ariaLabel}
      className={cx(
        'relative p-4 transition-none',
        gutterTop && 'mt-4',
        className,
      )}
      id={id}
      variant="outlined"
    >
      <Typography
        className="dark:text-white"
        component="h3"
        fontWeight="bold"
        gutterBottom
        id={titleId}
        variant="h5"
      >
        {title}
      </Typography>

      {children}
    </Paper>
  )
}

export default SettingsSection
