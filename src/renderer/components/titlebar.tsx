/*
 * 2022-2026 Kiyozz.
 */

import { cn } from '@renderer/lib/utils.ts'
import type { MouseEvent } from 'react'
import { bridge } from '../bridge'
import { useFocus } from '../hooks/use-focus'
import { usePlatform } from '../hooks/use-platform'
import { useTitlebarHeight } from '../hooks/use-titlebar-height'
import { useWindowState } from '../hooks/use-window-state'

function Titlebar() {
  const isFocus = useFocus()
  const platform = usePlatform()
  const windowState = useWindowState()
  const titlebarHeight = useTitlebarHeight()

  const isNotMacOs = platform !== 'macos' && platform !== 'macos-bigsur'
  const isMacOs = !isNotMacOs
  const isMacOsBigSur = platform === 'macos-bigsur'

  const handleCloseWindow = (e: MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur()
    void bridge.window.close()
  }

  const handleMinimizeWindow = async (e: MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur()
    await bridge.window.minimize()
  }

  const handleMaximizeWindow = async (e: MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur()
    await bridge.window.maximize()
  }

  const handleRestoreWindow = async (e: MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur()
    await bridge.window.restore()
  }

  return (
    <div
      className={cn(
        'titlebar drag justify-end border-b bg-sidebar',
        isMacOs && 'macos',
        isMacOsBigSur && 'macos-bigsur',
        isNotMacOs && 'other-platform',
        isFocus && 'focused',
        windowState === 'maximized' && 'maximized',
      )}
      data-height={titlebarHeight}
    >
      <span className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 z-50 font-mono font-semibold">
        Papyrus Compiler App
      </span>
      {isNotMacOs && (
        <div className="flex">
          <button
            className="titlebar-control"
            onClick={handleMinimizeWindow}
            tabIndex={-1}
            type="button"
          >
            &#xE921;
          </button>
          {windowState === 'maximized' ? (
            <button
              className="titlebar-control"
              onClick={handleRestoreWindow}
              tabIndex={-1}
              type="button"
            >
              &#xE923;
            </button>
          ) : (
            <button
              className="titlebar-control"
              onClick={handleMaximizeWindow}
              tabIndex={-1}
              type="button"
            >
              &#xE922;
            </button>
          )}
          <button
            className="titlebar-control titlebar-control-close"
            onClick={handleCloseWindow}
            tabIndex={-1}
            type="button"
          >
            &#xE8BB;
          </button>
        </div>
      )}
    </div>
  )
}

export { Titlebar }
