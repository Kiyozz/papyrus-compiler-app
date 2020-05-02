import { makeStyles, Theme } from '@material-ui/core/styles'
import React, { useMemo, useState } from 'react'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import { GroupModel } from '../../models'

interface Props {
  groups: GroupModel[]
  onChangeGroup: (groupName: string) => void
}

const useStyles = makeStyles((theme: Theme) => ({
  menu: {
    width: '100%'
  }
}))

const AppCompilationGroups: React.FC<Props> = ({ groups, onChangeGroup }) => {
  const classes = useStyles()
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => setAnchor(e.currentTarget)
  const onClose = () => setAnchor(null)

  const groupSelectOptions = useMemo(() => {
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
    <div className="app-compilation-action-group">
      {notEmptyGroups.length > 0 && (
        <>
          <Button aria-controls="load-group-menu" aria-haspopup="true" onClick={onClick}>
            Load a group
          </Button>

          <Menu
            id="load-group-menu"
            keepMounted
            className={classes.menu}
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

export default React.memo(AppCompilationGroups)
