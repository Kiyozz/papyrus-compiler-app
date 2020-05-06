import { createMuiTheme, ThemeProvider } from '@material-ui/core'
import purple from '@material-ui/core/colors/blueGrey'
import yellow from '@material-ui/core/colors/yellow'
import React from 'react'

interface Props {

}

const theme = createMuiTheme({
  palette: {
    primary: yellow,
    secondary: purple
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
