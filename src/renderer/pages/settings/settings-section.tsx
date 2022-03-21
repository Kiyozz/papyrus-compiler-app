/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { Paper, Typography } from '@mui/material'
import is from '@sindresorhus/is'
import cx from 'classnames'
import React, { PropsWithChildren, ReactNode } from 'react'

type Props = {
  title: ReactNode
  className?: string
  titleId?: string
  id?: string
  gutterTop?: boolean
  'aria-label'?: string
}

const SettingsSection = ({
  title,
  className,
  id,
  gutterTop = true,
  'aria-label': ariaLabel,
  titleId,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <Paper
      id={id}
      className={cx(
        'relative p-4 transition-none',
        gutterTop && 'mt-4',
        className,
      )}
      aria-label={is.string(title) ? title : ariaLabel}
      variant="outlined"
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        gutterBottom
        className="dark:text-white"
        component="h3"
        id={titleId}
      >
        {title}
      </Typography>

      {children}
    </Paper>
  )
}

export default SettingsSection
