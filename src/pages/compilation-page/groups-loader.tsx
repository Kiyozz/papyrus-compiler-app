import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

import React from 'react'

import { GroupModel } from '../../models'
import classes from './compilation-page.module.scss'

interface Props {
  groups: GroupModel[]
  onChangeGroup: (groupName: string) => void
}

const GroupsLoader: React.FC<Props> = ({ groups, onChangeGroup }) => {
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null)

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => setAnchor(e.currentTarget)
  const onClose = () => setAnchor(null)

  const groupSelectOptions = React.useMemo(() => {
    return groups.filter(group => group.scripts.length > 0).map(group => {
      const onClickGroup = () => {
        onClose()
        onChangeGroup(group.name)
      }

      return (
        <MenuItem value={group.name} key={group.name} onClick={onClickGroup}>
          {group.name}
        </MenuItem>
      )
    })
  }, [groups, onChangeGroup])

  const notEmptyGroups = groups.filter(group => group.scripts.length > 0)

  return (
    <div className={classes.group}>
      {notEmptyGroups.length > 0 && (
        <>
          <Button aria-controls="load-group-menu" aria-haspopup="true" onClick={onClick}>
            Load a group
          </Button>

          <Menu
            id="load-group-menu"
            keepMounted
            className={classes.fullWidth}
            open={!!anchor}
            onClose={onClose}
            anchorEl={anchor}
          >
            {groupSelectOptions}
          </Menu>
        </>
      )}
    </div>
  )
}

export default GroupsLoader
