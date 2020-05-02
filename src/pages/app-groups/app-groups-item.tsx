import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import AppPaper from '../../components/app-paper/app-paper'
import { GroupModel } from '../../models'
import AppGroupsItemMenu from './app-groups-item-menu'

interface Props {
  onMouseEnter: () => void
  onMouseLeave: () => void
  onMouseMove: () => void
  onEdit: (group: GroupModel) => () => void
  onDelete: (group: GroupModel) => () => void
  group: GroupModel
  hoveringGroup?: GroupModel
}

const useStyles = makeStyles(() => ({
  group: {
    position: 'relative'
  },
  actions: {
    position: 'absolute',
    top: 5,
    right: 5
  }
}))

const AppGroupsItem: React.FC<Props> = ({ group, onDelete, onEdit, onMouseEnter, onMouseLeave, onMouseMove }) => {
  const classes = useStyles()

  return (
    <AppPaper
      key={group.name}
      className={classes.group}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
    >
      <div className={classes.actions}>
        <AppGroupsItemMenu onEdit={onEdit(group)} onDelete={onDelete(group)} group={group} />
      </div>
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
