import Box from '@material-ui/core/Box'
import Fab from '@material-ui/core/Fab'
import Fade from '@material-ui/core/Fade'
import CreateIcon from '@material-ui/icons/Create'

import React from 'react'
import { connect } from 'react-redux'

import GroupsDialog from '../../components/groups-dialog/groups-dialog'
import Page from '../../components/page/page'
import PageAppBar from '../../components/page/page-app-bar'
import { GroupModel } from '../../models'
import { actionAddGroup, actionEditGroup, actionRemoveGroup } from '../../redux/actions'
import { RootStore } from '../../redux/stores/root.store'
import GroupsListItem from './groups-list-item'
import classes from './groups-page.module.scss'

export interface StateProps {
  groups: GroupModel[]
}

export interface DispatchesProps {
  addGroup: (group: GroupModel) => void
  removeGroup: (group: GroupModel) => void
  editGroup: (lastGroupName: string, group: GroupModel) => void
}

type Props = StateProps & DispatchesProps

const Component: React.FC<Props> = ({ groups, addGroup, removeGroup, editGroup }) => {
  const [showAddPopup, setShowPopup] = React.useState(false)
  const [editingGroup, setEditingGroup] = React.useState<GroupModel | undefined>(undefined)

  const onClickRemoveGroup = (group: GroupModel) => {
    return () => {
      removeGroup(group)
    }
  }

  const onClickEditGroup = (group: GroupModel) => {
    return () => {
      setEditingGroup(group)
      setShowPopup(true)
    }
  }

  const onClickAddButton = () => {
    setEditingGroup(undefined)
    setShowPopup(true)
  }

  const onGroupAdd = (group: Partial<GroupModel>) => {
    setShowPopup(false)

    addGroup(group as GroupModel)
  }

  const onGroupEdit = (lastGroupName: string, group: GroupModel) => {
    setShowPopup(false)
    editGroup(lastGroupName, group)
  }

  const onClosePopup = () => {
    setShowPopup(false)
  }

  return (
    <>
      <PageAppBar title="Groups" />

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
              <p>You can create a group with the top-right button.</p>
              <p>A group is a set of scripts that can be easily loaded on the compilation view.</p>
            </Box>
          </Fade>

          <div className={classes.fixedFab}>
            <Fab onClick={onClickAddButton} color="primary" variant="extended" aria-label="create a group">
              <CreateIcon className={classes.extended} /> Create
            </Fab>
          </div>
        </div>
      </Page>
    </>
  )
}

const GroupsPage = connect(
  (store: RootStore): StateProps => ({
    groups: store.groups.groups
  }),
  (dispatch): DispatchesProps => ({
    addGroup: group => dispatch(actionAddGroup(group)),
    removeGroup: group => dispatch(actionRemoveGroup(group)),
    editGroup: (lastGroupName, group) => dispatch(actionEditGroup({ group, lastName: lastGroupName }))
  })
)(Component)

export default GroupsPage
