import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import React from 'react'
import AppIcon from '../../assets/logo/vector/app-icon'
import { usePageContext } from './page-context'
import classes from './page.module.scss'

interface Action {
  text: string
  icon?: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

interface Props {
  title?: string
  actions?: Action[]
}

const PageAppBar: React.FC<Props> = ({ title, actions = [] }) => {
  const { setOpen, open } = usePageContext()

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton className={classes.appIcon} edge="start" color="inherit" onClick={() => setOpen(!open)}>
            <AppIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>{title}</Typography>
          <div>
            {actions.map((action) => (
              <Button color="inherit" key={action.text} startIcon={action.icon} onClick={action.onClick}>{action.text}</Button>
            ))}
          </div>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default PageAppBar
