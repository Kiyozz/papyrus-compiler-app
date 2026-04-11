/*
 * 2022-2026 Kiyozz.
 */

import { Theme } from '../../common/theme'
import { useSystemDarkPreference } from './use-system-dark-preference'
import { useTheme } from './use-theme'

export const useIsDarkTheme = () => {
  const isDark = useSystemDarkPreference()
  const [theme] = useTheme()

  return theme === Theme.system ? isDark : theme === Theme.dark
}
