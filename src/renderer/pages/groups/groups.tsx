/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import CreateIcon from '@mui/icons-material/Create'
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  List,
  Toolbar,
  Typography,
} from '@mui/material'
import cx from 'classnames'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useLocalStorage from 'react-use-localstorage'
import { TelemetryEvent } from '../../../common/telemetry-event'
import DialogGroup from '../../components/dialog/dialog-group'
import Page from '../../components/page'
import PageAppBar from '../../components/page-app-bar'
import { LocalStorage } from '../../enums/local-storage.enum'
import { useApp } from '../../hooks/use-app'
import { useGroups } from '../../hooks/use-groups'
import { useTelemetry } from '../../hooks/use-telemetry'
import GroupsListItem from './groups-list-item'
import type { Group } from '../../types'
import type { MouseEvent, ChangeEvent } from 'react'

function Groups() {
  const { send } = useTelemetry()
  const { t } = useTranslation()
  const { groups } = useApp()
  const { add, edit, remove } = useGroups()
  const [isMoreDetails, setMoreDetails] = useLocalStorage(
    LocalStorage.groupMoreDetails,
    'false',
  )

  const [isDialogOpen, setDialogOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<Group | undefined>()

  const onClickRemoveGroup = (group: Group) => {
    return (evt: MouseEvent<HTMLElement>) => {
      evt.currentTarget.blur()

      remove(group)
    }
  }

  const onClickEditGroup = (group: Group) => {
    return (evt: MouseEvent<HTMLElement>) => {
      evt.currentTarget.blur()

      setEditingGroup(group)
      setDialogOpen(true)
    }
  }

  const onClickAddButton = (evt: MouseEvent<HTMLElement>) => {
    evt.currentTarget.blur()

    setEditingGroup(undefined)
    setDialogOpen(true)
  }

  const onGroupAdd = (group: Group) => {
    setDialogOpen(false)
    add(group)
  }

  const onGroupEdit = (lastGroupName: string, group: Group) => {
    setDialogOpen(false)
    edit({ group, lastGroupName })
  }

  const onClosePopup = () => {
    setDialogOpen(false)
  }

  const onChangeMoreDetails = (evt: ChangeEvent<HTMLInputElement>) => {
    send(TelemetryEvent.groupMoreDetails, {
      moreDetails: evt.currentTarget.checked,
    })
    setMoreDetails(evt.currentTarget.checked ? 'true' : 'false')
  }

  return (
    <>
      <PageAppBar title={t('page.groups.title')}>
        <Button onClick={onClickAddButton} startIcon={<CreateIcon />}>
          {t('page.groups.actions.create')}
        </Button>
      </PageAppBar>

      <Page className={cx(groups.length > 0 && 'pt-0')}>
        <DialogGroup
          group={editingGroup}
          onClose={onClosePopup}
          onGroupAdd={onGroupAdd}
          onGroupEdit={onGroupEdit}
          open={isDialogOpen}
        />

        {groups.length > 0 && (
          <Toolbar className="p-0">
            <FormGroup className="ml-auto">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isMoreDetails === 'true'}
                    onChange={onChangeMoreDetails}
                  />
                }
                label={t<string>('common.moreDetails')}
              />
            </FormGroup>
          </Toolbar>
        )}

        {groups.length > 0 ? (
          <List className="flex flex-col gap-2">
            {groups.map(group => (
              <GroupsListItem
                group={group}
                key={group.name}
                moreDetails={isMoreDetails === 'true'}
                onDelete={onClickRemoveGroup}
                onEdit={onClickEditGroup}
              />
            ))}
          </List>
        ) : (
          <div className="h-full w-full justify-center gap-4 text-lg">
            <Typography gutterBottom variant="h6">
              {t('page.groups.createGroupText')}
            </Typography>
            <Typography variant="body2">
              {t('page.groups.whatIsAGroup')}
            </Typography>
          </div>
        )}
      </Page>
    </>
  )
}

export default Groups
