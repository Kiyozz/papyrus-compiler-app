/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { createMuiTheme, ThemeProvider } from '@material-ui/core'
import red from '@material-ui/core/colors/red'
import React from 'react'

import { useDarkPreference } from './hooks/use-dark-preference'

export function Theme({
  children
}: React.PropsWithChildren<unknown>): JSX.Element {
  const isDark = useDarkPreference()

  const theme = createMuiTheme({
    palette: {
      type: isDark ? 'dark' : 'light',
      primary: {
        main: '#539dff',
        light: '#539dff'
      },
      secondary: {
        main: '#2cb67d',
        light: '#3fc68e'
      },
      error: {
        main: red['300'],
        light: '#e45858'
      }
    },
    overrides: {
      MuiRadio: {
        root: {
          '&$checked$colorSecondary': {
            color: '#539dff'
          }
        }
      }
    }
  })

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
