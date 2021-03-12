/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import React from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  name: string
  onClose: () => void
  isEdit: boolean
  AddScriptsButton?: JSX.Element | null
}

export function GroupsDialogActions({
  name,
  AddScriptsButton,
  onClose,
  isEdit
}: Props): JSX.Element {
  const { t } = useTranslation()

  return (
    <>
      <div className="mr-auto">{AddScriptsButton}</div>
      <button className="btn" type="button" onClick={onClose}>
        {t('page.groups.dialog.close')}
      </button>
      <button className="btn btn-primary" type="submit" disabled={name === ''}>
        {isEdit
          ? t('page.groups.actions.edit')
          : t('page.groups.actions.create')}
      </button>
    </>
  )
}
