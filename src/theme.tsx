import { createMuiTheme, ThemeProvider } from '@material-ui/core'
import blueGrey from '@material-ui/core/colors/blueGrey'
import brown from '@material-ui/core/colors/brown'
import red from '@material-ui/core/colors/red'
import React from 'react'

interface Props {

}

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: brown['200'],
      light: brown['A400']
    },
    secondary: blueGrey,
    error: {
      main: red['300']
    }
  }
})

const Theme: React.FC<Props> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  )
}

export default Theme
