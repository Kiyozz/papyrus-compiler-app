import Box from '@material-ui/core/Box'
import Fade from '@material-ui/core/Fade'
import CreateIcon from '@material-ui/icons/Create'
import { RouteComponentProps } from '@reach/router'
import is from '@sindresorhus/is'

import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import GroupsDialog from '../../components/groups-dialog/groups-dialog'
import Page from '../../components/page/page'
import PageAppBar from '../../components/page/page-app-bar'
import { usePageContext } from '../../components/page/page-context'
import { GroupModel } from '../../models'
import GroupsListItem from './groups-list-item'
import classes from './groups-page.module.scss'

type Props = RouteComponentProps

interface EditGroupParams {
  group: GroupModel
  lastGroupName: string
}

const GroupsPage: React.FC<Props> = () => {
  const { t } = useTranslation()
  const { groups, updateConfig } = usePageContext()
  const addGroup = useCallback(
    (group: GroupModel) => {
      if (!is.undefined(groups.find(g => g.name.trim().toLowerCase() === group.name.trim().toLowerCase()))) {
        return
      }

      updateConfig({
        groups: [
          ...groups,
          {
            name: group.name,
            scripts: group.scripts.map(s => ({ name: s.name, path: s.path }))
          }
        ]
      })
    },
    [updateConfig, groups]
  )
  const editGroup = useCallback(
    ({ group, lastGroupName }: EditGroupParams) => {
      if (
        group.name.trim().toLowerCase() !== lastGroupName.trim().toLowerCase() &&
        !is.undefined(groups.find(g => g.name.trim().toLowerCase() === group.name.trim().toLowerCase()))
      ) {
        return
      }

      updateConfig({
        groups: groups.map(g => {
          if (g.name === lastGroupName) {
            return {
              scripts: group.scripts.map(s => ({ name: s.name, path: s.path })),
              name: group.name
            }
          }

          return {
            ...g,
            scripts: g.scripts.map(s => ({ name: s.name, path: s.path }))
          }
        })
      })
    },
    [groups, updateConfig]
  )
  const removeGroup = useCallback(
    (group: GroupModel) => {
      if (is.undefined(groups.find(g => g.name.trim().toLowerCase() === group.name.trim().toLowerCase()))) {
        return
      }

      updateConfig(
        {
          groups: groups.map(g => ({ name: g.name, scripts: g.scripts })).filter(g => g.name !== group.name)
        },
        true
      )
    },
    [groups, updateConfig]
  )

  const [showAddPopup, setShowPopup] = useState(false)
  const [editingGroup, setEditingGroup] = useState<GroupModel | undefined>(undefined)

  const onClickRemoveGroup = useCallback(
    (group: GroupModel) => {
      return () => {
        removeGroup(group)
      }
    },
    [removeGroup]
  )

  const onClickEditGroup = useCallback((group: GroupModel) => {
    return () => {
      setEditingGroup(group)
      setShowPopup(true)
    }
  }, [])

  const onClickAddButton = useCallback(() => {
    setEditingGroup(undefined)
    setShowPopup(true)
  }, [])

  const onGroupAdd = useCallback(
    (group: Partial<GroupModel>) => {
      setShowPopup(false)
      addGroup(group as GroupModel)
    },
    [setShowPopup, addGroup]
  )

  const onGroupEdit = useCallback(
    (lastGroupName: string, group: GroupModel) => {
      setShowPopup(false)
      editGroup({ group, lastGroupName })
    },
    [setShowPopup, editGroup]
  )

  const onClosePopup = useCallback(() => {
    setShowPopup(false)
  }, [])

  return (
    <>
      <PageAppBar
        title={t('page.groups.title')}
        actions={[
          {
            text: t('page.groups.actions.create'),
            icon: <CreateIcon />,
            onClick: onClickAddButton
          }
        ]}
      />

      <Page>
        <div>
          <GroupsDialog group={editingGroup} open={showAddPopup} onGroupAdd={onGroupAdd} onGroupEdit={onGroupEdit} onClose={onClosePopup} />

          <Fade in={groups.length > 0}>
            <div className={classes.groupsList}>
              {groups.map(group => {
                return <GroupsListItem onDelete={onClickRemoveGroup} onEdit={onClickEditGroup} group={group} key={group.name} />
              })}
            </div>
          </Fade>

          <Fade in={groups.length === 0}>
            <Box>
              <p>{t('page.groups.createGroupText')}</p>
              <p>{t('page.groups.whatIsAGroup')}</p>
            </Box>
          </Fade>
        </div>
      </Page>
    </>
  )
}

export default GroupsPage
