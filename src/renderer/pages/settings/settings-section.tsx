/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import cx from 'classnames'
import type { PropsWithChildren, ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx'

interface SettingsSectionProps {
  title: ReactNode
  className?: string
  titleId?: string
  id?: string
  'aria-label'?: string
}

function SettingsSection({
  title,
  className,
  id,
  'aria-label': ariaLabel,
  titleId,
  children,
}: PropsWithChildren<SettingsSectionProps>) {
  return (
    <Card
      aria-label={is.string(title) ? title : ariaLabel}
      className={cx('relative p-4 transition-none', className)}
      id={id}
    >
      <CardHeader>
        <CardTitle id={titleId}>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export default SettingsSection
