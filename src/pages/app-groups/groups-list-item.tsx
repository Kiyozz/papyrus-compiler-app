import React from 'react'

import AppPaper from '../../components/app-paper/app-paper'
import { GroupModel } from '../../models'
import GroupsListItemMenu from './groups-list-item-menu'
import classes from './groups-page.module.scss'

interface Props {
  onEdit: (group: GroupModel) => () => void
  onDelete: (group: GroupModel) => () => void
  group: GroupModel
}

const GroupsListItem: React.FC<Props> = ({ group, onDelete, onEdit }) => {
  return (
    <AppPaper
      key={group.name}
      className={classes.item}
    >
      <div className={classes.actions}>
        <GroupsListItemMenu onEdit={onEdit(group)} onDelete={onDelete(group)} group={group} />
      </div>
      <div className="app-groups-list-group-item-name">{group.name}</div>
      <div className={classes.scripts}>
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

export default GroupsListItem
