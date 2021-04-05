/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import SearchIcon from '@material-ui/icons/Search'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { useApp } from '../../hooks/use-app'

interface Props {
  name: string
  onClose: () => void
  isEdit: boolean
}

export function GroupsDialogActions({
  name,
  onClose,
  isEdit
}: Props): JSX.Element {
  const { t } = useTranslation()
  const { openDrop } = useApp()

  return (
    <>
      <div className="mr-auto">
        <button className="btn" onClick={openDrop}>
          <div className="icon">
            <SearchIcon />
          </div>
          {t('page.compilation.actions.searchScripts')}
        </button>
      </div>
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
