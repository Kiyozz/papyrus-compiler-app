/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import { createMuiTheme, ThemeProvider } from '@material-ui/core'
import red from '@material-ui/core/colors/red'
import React from 'react'

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#7f5af0',
      light: '#896ce3'
    },
    background: {
      default: '#242629',
      paper: '#16161a'
    },
    secondary: {
      main: '#2cb67d',
      light: '#3fc68e'
    },
    error: {
      main: red['300']
    }
  }
})

export const Theme: React.FC = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
