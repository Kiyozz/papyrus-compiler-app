import AppBar from '@material-ui/core/AppBar'
import IconButton, { IconButtonProps } from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button, { ButtonProps } from '@material-ui/core/Button'
import React from 'react'
import classes from './page.module.scss'

interface Action {
  text?: string
  icon?: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  buttonProps?: ButtonProps
  iconButtonProps?: IconButtonProps
}

interface Props {
  title?: string
  actions?: Action[]
}

const PageAppBar: React.FC<Props> = ({ title, actions = [] }) => {
  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>{title}</Typography>
          <div>
            {actions.map((action, index) => {
              if (typeof action.text === 'undefined' && typeof action.icon !== 'undefined') {
                return (
                  <IconButton
                    color="inherit"
                    key={index}
                    onClick={action.onClick}
                    {...action.iconButtonProps}
                  >
                    {action.icon}
                  </IconButton>
                )
              }

              return (
                <Button
                  color="inherit"
                  key={action.text}
                  startIcon={action.icon}
                  onClick={action.onClick}
                  {...action.buttonProps}
                >
                  {action.text}
                </Button>
              )
            })}
          </div>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default PageAppBar
