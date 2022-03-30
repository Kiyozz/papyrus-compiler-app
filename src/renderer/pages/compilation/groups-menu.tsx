/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import AddIcon from '@mui/icons-material/Add'
import { Button, Menu, MenuItem } from '@mui/material'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TelemetryEvent } from '../../../common/telemetry-event'
import { useDocumentClick } from '../../hooks/use-document-click'
import { useTelemetry } from '../../hooks/use-telemetry'
import { isChildren } from '../../html/is-child'
import type { Group } from '../../types'

interface GroupsMenuProps {
  groups: Group[]
  onChangeGroup: (groupName: string) => void
}

function GroupsMenu({ groups, onChangeGroup }: GroupsMenuProps) {
  const { t } = useTranslation()
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const { send } = useTelemetry()

  useDocumentClick(
    () => {
      setAnchor(null)
    },
    clicked =>
      ((anchor && clicked !== anchor) ?? false) && !isChildren(anchor, clicked),
  )

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchor(e.currentTarget)
  }

  const onClose = () => {
    setAnchor(null)
  }

  const groupSelectOptions = useMemo(() => {
    return groups
      .filter((group: Group): boolean => !group.isEmpty)
      .map(group => {
        const onClickGroup = () => {
          send(TelemetryEvent.compilationGroupLoaded, {
            groups: groups.length,
          })
          setAnchor(null)
          onChangeGroup(group.name)
        }

        return (
          <MenuItem
            className="justify-center"
            key={group.name}
            onClick={onClickGroup}
          >
            {group.name}
          </MenuItem>
        )
      })
  }, [groups, onChangeGroup, send])

  const notEmptyGroups = groups.filter(
    (group: Group): boolean => !group.isEmpty,
  )

  const isOpen = Boolean(anchor)

  return (
    <div>
      {notEmptyGroups.length > 0 && (
        <>
          <Button
            aria-controls={isOpen ? 'group-loader-menu' : undefined}
            aria-expanded={isOpen ? 'true' : undefined}
            aria-haspopup="true"
            onClick={onClick}
            startIcon={<AddIcon />}
          >
            {t('page.compilation.actions.group')}
          </Button>
          <Menu
            anchorEl={anchor}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            classes={{
              list: 'min-w-[100px]',
            }}
            id="group-loader-menu"
            onClose={onClose}
            open={isOpen}
          >
            {groupSelectOptions}
          </Menu>
        </>
      )}
    </div>
  )
}

export default GroupsMenu
