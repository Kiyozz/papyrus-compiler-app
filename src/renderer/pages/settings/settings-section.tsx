/*
 * 2022-2026 Kiyozz.
 */

import is from '@sindresorhus/is'
import cx from 'classnames'
import type { ComponentProps, PropsWithChildren, ReactNode } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@renderer/components/ui/card.tsx'

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
      className={cx(className)}
      id={id}
    >
      <CardHeader>
        <CardTitle id={titleId}>{title}</CardTitle>
      </CardHeader>
      {children}
    </Card>
  )
}

function SettingsSectionContent(props: ComponentProps<typeof CardContent>) {
  return <CardContent {...props} />
}

export { SettingsSection, SettingsSectionContent, type SettingsSectionProps }
