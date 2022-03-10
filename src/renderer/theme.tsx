/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material'
import red from '@mui/material/colors/red'
import React from 'react'

import { Theme as SettingsTheme } from '../common/theme'
import { useSystemDarkPreference } from './hooks/use-system-dark-preference'
import { useTheme } from './hooks/use-theme'

const Theme = ({ children }: React.PropsWithChildren<unknown>) => {
  const isDark = useSystemDarkPreference()
  const [currentTheme] = useTheme()

  const theme = createTheme({
    palette: {
      mode:
        currentTheme === SettingsTheme.system
          ? isDark
            ? 'dark'
            : 'light'
          : currentTheme === SettingsTheme.dark
          ? 'dark'
          : 'light',
      primary: {
        main: '#539dff',
        light: '#539dff',
      },
      secondary: {
        main: '#2cb67d',
        light: '#3fc68e',
      },
      error: {
        main: red['300'],
        light: '#e45858',
      },
    },
    components: {
      MuiRadio: {
        styleOverrides: {
          root: {
            '&.Mui-checked.Mui-colorSecondary': {
              color: '#539dff',
            },
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            '&.Mui-checked.Mui-colorSecondary': {
              color: '#539dff',
            },
          },
        },
      },
    },
  })

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </StyledEngineProvider>
  )
}

export default Theme
