import Fade from '@material-ui/core/Fade'
import { makeStyles, Theme } from '@material-ui/core/styles'
import CreateIcon from '@material-ui/icons/Create'
import DeleteIcon from '@material-ui/icons/Delete'
import React from 'react'
import AppPaper from '../../components/app-paper/app-paper'
import { GroupModel } from '../../models'

interface Props {
  onMouseEnter: () => void
  onMouseLeave: () => void
  onMouseMove: () => void
  onEdit: (group: GroupModel) => () => void
  onDelete: (group: GroupModel) => () => void
  group: GroupModel
  hoveringGroup?: GroupModel
}

const useStyles = makeStyles((theme: Theme) => ({
  group: {
    position: 'relative'
  }
}))

const AppGroupsItem: React.FC<Props> = ({ group, hoveringGroup, onDelete, onEdit, onMouseEnter, onMouseLeave, onMouseMove }) => {
  const classes = useStyles()

  return (
    <AppPaper
      key={group.name}
      className={classes.group}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
    >
      <Fade
        in={hoveringGroup === group}
        mountOnEnter
        unmountOnExit
      >
        <div className="app-list-group-item-group-hover">
          <span
            className="app-list-group-item-group-hover-action app-list-group-item-group-hover-edit"
            onClick={onEdit(group)}
          >
            <CreateIcon />
          </span>
          <span
            className="app-list-group-item-group-hover-action app-list-group-item-group-hover-remove"
            onClick={onDelete(group)}
          >
            <DeleteIcon />
          </span>
        </div>
      </Fade>
      <div className="app-groups-list-group-item-name">{group.name}</div>
      <div className="app-groups-list-group-item-scripts">
        {group.scripts.length > 0 ? (
          <>
            {group.scripts.slice(0, 3).map((script) => script.name).join(', ')}
            {group.scripts.length > 3 ? ', ...' : ''}
          </>
        ) : (
          <>
            No scripts
          </>
        )}
      </div>
    </AppPaper>
  )
}

export default AppGroupsItem
