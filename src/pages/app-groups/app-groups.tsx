import Box from '@material-ui/core/Box'
import Fade from '@material-ui/core/Fade'
import { styled, makeStyles, Theme } from '@material-ui/core/styles'
import CreateIcon from '@material-ui/icons/Create'
import DeleteIcon from '@material-ui/icons/Delete'
import React, { useCallback, useMemo, useState } from 'react'
import './app-groups.scss'
import AppPaper from '../../components/app-paper/app-paper'
import { GroupModel } from '../../models'
import AppGroupsAddPopup from '../../components/app-groups-add-popup/app-groups-add-popup'
import map from 'lodash-es/map'
import max from 'lodash-es/max'
import AppGroupsItem from './app-groups-item'
import AppGroupsTitle from './app-groups-title'

export interface StateProps {
  groups: GroupModel[]
}

export interface DispatchesProps {
  addGroup: (group: GroupModel) => void
  removeGroup: (group: GroupModel) => void
  editGroup: (group: GroupModel) => void
}

type Props = StateProps & DispatchesProps

const GroupsList = styled('div')({
  position: 'relative'
})

const AppGroups: React.FC<Props> = ({ groups, addGroup, removeGroup, editGroup }) => {
  const [showAddPopup, setShowPopup] = useState(false)
  const [isHoveringGroup, setHoveringGroup] = useState<GroupModel | undefined>(undefined)
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
  }, [setEditingGroup])

  const createOnMouseEvent = useCallback((group?: GroupModel) => {
    return () => {
      if (showAddPopup) {
        return
      }

      if (isHoveringGroup !== group) {
        setHoveringGroup(group)
      }
    }
  }, [setHoveringGroup, isHoveringGroup, showAddPopup])

  const lastId = useMemo(() => {
    return (max(
      groups.map((group) => max(map(group.scripts, 'id')))
    ) ?? 0) + 1
  }, [groups])

  const onClickAddButton = useCallback(() => {
    setEditingGroup(undefined)
    setShowPopup(true)
  }, [setShowPopup])

  const onGroupAdd = useCallback((group: Partial<GroupModel>) => {
    setShowPopup(false)

    group.id = (max(map(groups, 'id')) ?? 0) + 1

    addGroup(group as GroupModel)
  }, [addGroup, groups, setShowPopup])

  const onGroupEdit = useCallback((group: GroupModel) => {
    setShowPopup(false)
    editGroup(group)
  }, [editGroup, setShowPopup])

  const onClosePopup = useCallback(() => {
    setShowPopup(false)
  }, [setShowPopup])

  const groupsList = useMemo(() => {
    return groups.map((group) => {
      const onMouseEnterGroup = createOnMouseEvent(group)
      const onMouseLeaveGroup = createOnMouseEvent(undefined)
      const onMouseMoveGroup = createOnMouseEvent(group)

      return (
        <AppGroupsItem
          onMouseEnter={onMouseEnterGroup}
          onMouseLeave={onMouseLeaveGroup}
          onMouseMove={onMouseMoveGroup}
          onDelete={onClickRemoveGroup}
          onEdit={onClickEditGroup}
          hoveringGroup={isHoveringGroup}
          group={group}
          key={group.id}
        />
      )
    })
  }, [groups, createOnMouseEvent, isHoveringGroup, onClickRemoveGroup, onClickEditGroup])

  return (
    <div className="app-groups container">
      <AppGroupsTitle onClickAddButton={onClickAddButton} />

      <div className="app-groups-content">
        <Fade in={showAddPopup} mountOnEnter unmountOnExit>
          <AppGroupsAddPopup
            group={editingGroup}
            open={showAddPopup}
            onGroupAdd={onGroupAdd}
            onGroupEdit={onGroupEdit}
            onClose={onClosePopup}
          />
        </Fade>

        <Fade in={groupsList.length > 0}>
          <GroupsList>
            {groupsList}
          </GroupsList>
        </Fade>

        <Fade in={groupsList.length === 0}>
          <Box>
            <p>You can create a group with the top-right button.</p>
            <p>A group is a set of scripts that can be easily loaded on the compilation view.</p>
          </Box>
        </Fade>
      </div>
    </div>
  )
}

export default AppGroups
