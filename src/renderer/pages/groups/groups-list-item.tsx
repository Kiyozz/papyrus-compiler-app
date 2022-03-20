/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Fade from '../../components/animations/fade'
import { Group, GroupRenderer } from '../../types'
import GroupsListItemMenu from './groups-list-item-menu'

type Props = {
  onEdit: (group: GroupRenderer) => () => void
  onDelete: (group: GroupRenderer) => () => void
  group: Group
}

const GroupsListItem = ({ group, onDelete, onEdit }: Props) => {
  const { t } = useTranslation()
  const [isDisplayPreview, setDisplayPreview] = useState(false)
  const [isHoveringItem, setHoveringItem] = useState(false)

  const onMouseEnter = useCallback(() => {
    setHoveringItem(true)
  }, [])

  const onMouseLeave = useCallback(() => {
    setHoveringItem(false)
  }, [])

  useEffect(() => {
    let timerDisplay: NodeJS.Timeout

    if (!group.isEmpty) {
      if (isHoveringItem) {
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
  }, [isHoveringItem, group.isEmpty])

  return (
    <div
      className="paper relative flex items-center"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Group preview */}
      <Fade in={isDisplayPreview} timeout={200}>
        <div className="absolute top-0 left-0 right-16 z-10 rounded bg-light-300 px-4 py-2 dark:bg-black-400 dark:text-white">
          <h3 className="grow text-center text-xl">
            {t('page.groups.group', { name: group.name })}
          </h3>

          {/* Group list in preview */}
          <div className="mt-6 flex flex-col text-sm">
            {group.scripts.map(script => {
              return <div key={script.id}>{script.name}</div>
            })}
          </div>
        </div>
      </Fade>

      <div className="grow">
        <div className="text-black-800 dark:text-white">{group.name}</div>
        <div className="pl-2 text-xs text-black-600 dark:text-white">
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

export default GroupsListItem
