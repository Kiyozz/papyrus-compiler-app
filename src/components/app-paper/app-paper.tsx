import cx from 'classnames'
import { makeStyles } from '@material-ui/core/styles'
import Paper, { PaperProps } from '@material-ui/core/Paper'
import React from 'react'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
    '& + &': {
      marginTop: theme.spacing(1)
    }
  }
}))

const AppPaper: React.FC<PaperProps> = ({ children, ...props }) => {
  const classes = useStyles()

  return (
    <Paper className={cx(classes.root, props.className)} {...props}>
      {children}
    </Paper>
  )
}

export default React.memo(AppPaper)
