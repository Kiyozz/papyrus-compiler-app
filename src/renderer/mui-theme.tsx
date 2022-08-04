/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import {
  createTheme,
  ThemeProvider,
  StyledEngineProvider,
  CssBaseline,
} from '@mui/material'
import red from '@mui/material/colors/red'
import React from 'react'
import { useIsDarkTheme } from './hooks/use-is-dark-theme'
import { usePlatform } from './hooks/use-platform'
import type { PaletteMode, PaletteOptions } from '@mui/material'

function MuiTheme({ children }: React.PropsWithChildren) {
  const isDarkTheme = useIsDarkTheme()
  const platform = usePlatform()
  const mode: PaletteMode = isDarkTheme ? 'dark' : 'light'
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
      MuiBackdrop: {
        styleOverrides: {
          root: {
            top: platform === 'windows' ? 32 : 34,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          root: {
            top: 32,
          },
          scrollBody: {
            '& .MuiDialog-paper': {
              // Intentional, overlay is chromium specific, and no standard
              overflowY: 'overlay' as unknown as 'hidden',
            },
          },
          scrollPaper: {
            '& .MuiDialogContent-root': {
              // Intentional, overlay is chromium specific, and no standard
              overflowY: 'overlay' as unknown as 'hidden',
            },
          },
        },
      },
      MuiTypography: {
        defaultProps: {
          gutterBottom: false,
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
          color: 'inherit',
          type: 'button',
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
    <CssBaseline>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </StyledEngineProvider>
    </CssBaseline>
  )
}

export default MuiTheme
