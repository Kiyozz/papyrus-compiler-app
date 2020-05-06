import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import CreateIcon from '@material-ui/icons/Create'
import DeleteIcon from '@material-ui/icons/Delete'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import React from 'react'
import { GroupModel } from '../../models'

interface Props {
  onEdit: () => void
  onDelete: () => void
  group: GroupModel
}

const GroupsListItemMenu: React.FC<Props> = ({ group, onDelete, onEdit }) => {
  const [anchorMenu, setAnchorMenu] = React.useState<HTMLElement | null>(null)
  const menuId = `group-${group.name}`

  const onOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorMenu(e.currentTarget)
  const onClose = () => setAnchorMenu(null)

  const onClickEdit = () => {
    onClose()
    onEdit()
  }

  const onClickDelete = () => {
    onClose()
    onDelete()
  }

  return (
    <>
      <IconButton onClick={onOpen} aria-controls={menuId} aria-haspopup="true">
        <MoreVertIcon />
      </IconButton>
      <Menu
        id={menuId}
        keepMounted
        onClose={onClose}
        anchorEl={anchorMenu}
        open={anchorMenu !== null}
      >
        <MenuItem onClick={onClickEdit}>
          <ListItemIcon>
            <CreateIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <Typography variant="inherit">Edit</Typography>
        </MenuItem>
        <MenuItem onClick={onClickDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <Typography variant="inherit">Delete</Typography>
        </MenuItem>
      </Menu>
    </>
  )
}

export default GroupsListItemMenu
