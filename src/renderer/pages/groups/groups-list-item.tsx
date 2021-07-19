/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Fade from '../../components/animations/fade'
import { Group, GroupInterface } from '../../interfaces'
import { GroupsListItemMenu } from './groups-list-item-menu'

interface Props {
  onEdit: (group: GroupInterface) => () => void
  onDelete: (group: GroupInterface) => () => void
  group: Group
}

export function GroupsListItem({
  group,
  onDelete,
  onEdit,
}: Props): JSX.Element {
  const { t } = useTranslation()
  const [isDisplayPreview, setDisplayPreview] = useState(false)
  const [isEnter, setEnter] = useState(false)

  const onMouseEnter = useCallback(() => {
    setEnter(true)
  }, [])

  const onMouseLeave = useCallback(() => {
    setEnter(false)
  }, [])

  useEffect(() => {
    let timerDisplay: NodeJS.Timeout

    if (!group.isEmpty) {
      if (isEnter) {
        timerDisplay = setTimeout(() => {
          setDisplayPreview(true)
        }, 500)
      } else {
        timerDisplay = setTimeout(() => {
          setDisplayPreview(false)
        }, 200)
      }
    }

    return () => {
      if (!is.undefined(timerDisplay)) {
        clearTimeout(timerDisplay)
      }
    }
  }, [isEnter, group.isEmpty])

  return (
    <div
      className="paper flex items-center relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Group review */}
      <Fade in={isDisplayPreview} timeout={200}>
        <div className="absolute z-10 top-0 left-0 right-16 bg-light-300 dark:bg-black-400 rounded px-4 py-2 dark:text-white">
          <div className="flex mb-6">
            <h3 className="text-xl text-center flex-grow">
              {t('page.groups.group', { name: group.name })}
            </h3>
          </div>

          {/* Group list in preview */}
          <div className="flex flex-col text-sm">
            {group.isEmpty ? (
              <div>{t('page.groups.noScripts')}</div>
            ) : (
              group.scripts.map(script => {
                return <div key={script.id}>{script.name}</div>
              })
            )}
          </div>
        </div>
      </Fade>

      <div className="flex-grow">
        <div className="text-black-800 dark:text-white">{group.name}</div>
        <div className="text-xs pl-2 text-black-600 dark:text-white">
          {!group.isEmpty ? (
            <>
              {group.scripts
                .slice(0, 5)
                .map(script => script.name)
                .join(', ')}
              {group.scripts.length > 3 ? ', ...' : ''}
            </>
          ) : (
            <>{t('page.groups.noScripts')}</>
          )}
        </div>
      </div>

      <GroupsListItemMenu onEdit={onEdit(group)} onDelete={onDelete(group)} />
    </div>
  )
}
