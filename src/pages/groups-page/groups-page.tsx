import Box from '@material-ui/core/Box'
import Fade from '@material-ui/core/Fade'
import CreateIcon from '@material-ui/icons/Create'
import { RouteComponentProps } from '@reach/router'

import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import GroupsDialog from '../../components/groups-dialog/groups-dialog'
import Page from '../../components/page/page'
import PageAppBar from '../../components/page/page-app-bar'
import { Group, GroupModel } from '../../models'
import actions from '../../redux/actions'
import { useAction, useStoreSelector } from '../../redux/use-store-selector'
import GroupsListItem from './groups-list-item'
import classes from './groups-page.module.scss'

type Props = RouteComponentProps

const GroupsPage: React.FC<Props> = () => {
  const { t } = useTranslation()
  const groups = useStoreSelector(state => state.groups.groups.map(g => new Group(g.name, g.scripts)))
  const addGroup = useAction(actions.groupsPage.add)
  const editGroup = useAction(actions.groupsPage.edit)
  const removeGroup = useAction(actions.groupsPage.remove)

  const [showAddPopup, setShowPopup] = useState(false)
  const [editingGroup, setEditingGroup] = useState<GroupModel | undefined>(undefined)

  const onClickRemoveGroup = useCallback((group: GroupModel) => {
    return () => {
      removeGroup(group)
    }
  }, [removeGroup])

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

  const onGroupAdd = useCallback((group: Partial<GroupModel>) => {
    setShowPopup(false)
    addGroup(group as GroupModel)
  }, [setShowPopup, addGroup])

  const onGroupEdit = useCallback((lastGroupName: string, group: GroupModel) => {
    setShowPopup(false)
    editGroup({ group, lastName: lastGroupName })
  }, [setShowPopup, editGroup])

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
          <GroupsDialog
            group={editingGroup}
            open={showAddPopup}
            onGroupAdd={onGroupAdd}
            onGroupEdit={onGroupEdit}
            onClose={onClosePopup}
          />

          <Fade in={groups.length > 0}>
            <div className={classes.groupsList}>
              {
                groups.map((group) => {
                  return (
                    <GroupsListItem
                      onDelete={onClickRemoveGroup}
                      onEdit={onClickEditGroup}
                      group={group}
                      key={group.name}
                    />
                  )
                })
              }
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
