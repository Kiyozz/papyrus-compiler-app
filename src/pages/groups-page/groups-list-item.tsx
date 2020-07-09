import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import React from 'react'

import { Group, GroupModel } from '../../models'
import GroupsListItemMenu from './groups-list-item-menu'
import classes from './groups-page.module.scss'

interface Props {
  onEdit: (group: GroupModel) => () => void
  onDelete: (group: GroupModel) => () => void
  group: Group
}

const GroupsListItem: React.FC<Props> = ({ group, onDelete, onEdit }) => {
  return (
    <Paper
      key={group.name}
      className={classes.item}
    >
      <div className={classes.actions}>
        <GroupsListItemMenu onEdit={onEdit(group)} onDelete={onDelete(group)} group={group} />
      </div>
      <Typography variant="body1" component="div">{group.name}</Typography>
      <Typography variant="body2" component="div" className={classes.scripts}>
        {!group.isEmpty() ? (
          <>
            {group.scripts.slice(0, 3).map((script) => script.name).join(', ')}
            {group.scripts.length > 3 ? ', ...' : ''}
          </>
        ) : (
          <>
            No scripts
          </>
        )}
      </Typography>
    </Paper>
  )
}

export default GroupsListItem
