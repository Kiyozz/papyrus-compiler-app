/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import {
  createTheme,
  ThemeProvider,
  StyledEngineProvider,
  PaletteMode,
  PaletteOptions,
} from '@mui/material'
import red from '@mui/material/colors/red'
import React from 'react'

import { Theme as SettingsTheme } from '../common/theme'
import { useSystemDarkPreference } from './hooks/use-system-dark-preference'
import { useTheme } from './hooks/use-theme'

const MuiTheme = ({ children }: React.PropsWithChildren<unknown>) => {
  const isDark = useSystemDarkPreference()
  const [currentTheme] = useTheme()
  const mode: PaletteMode =
    currentTheme === SettingsTheme.system
      ? isDark
        ? 'dark'
        : 'light'
      : currentTheme === SettingsTheme.dark
      ? 'dark'
      : 'light'

  const palette: PaletteOptions =
    mode === 'light'
      ? {
          mode,
          primary: { main: '#2c5896', light: '#3388ff', dark: '#1f3e69' },
          secondary: { main: '#2cb67d', light: '#3fc68e' },
          error: { main: red['300'], light: '#e45858' },
        }
      : {
          mode,
          primary: { main: '#3388ff', light: '#2c5896', dark: '#2c5896' },
          secondary: { main: '#2cb67d', light: '#3fc68e' },
          error: { main: red['300'], light: '#e45858' },
        }

  const theme = createTheme({
    palette,
    zIndex: {
      appBar: 20,
      drawer: 20,
      modal: 40,
    },
    components: {
      MuiAppBar: {
        defaultProps: {
          position: 'sticky',
          className: 'shadow-b',
        },
      },
      MuiList: {
        defaultProps: {
          dense: true,
        },
      },
      MuiListItem: {
        defaultProps: {
          dense: true,
        },
      },
      MuiListItemButton: {
        defaultProps: {
          dense: true,
        },
      },
      MuiButton: {
        defaultProps: {
          disableRipple: true,
          color: 'inherit',
        },
        styleOverrides: {
          root: {
            textTransform: 'inherit',
          },
        },
      },
      MuiMenuItem: {
        defaultProps: {
          disableRipple: true,
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

export default MuiTheme
