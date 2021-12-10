import cx from 'classnames'
import React, { MouseEvent } from 'react'

import bridge from '../bridge'
import { useFocus } from '../hooks/use-focus'
import { usePlatform } from '../hooks/use-platform'
import { useWindowState } from '../hooks/use-window-state'

type Props = {
  title: string
}

export const Titlebar = ({ title }: Props) => {
  const isFocus = useFocus()
  const platform = usePlatform()
  const windowState = useWindowState()

  const handleClickMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur()
    bridge.titlebar.openMenu({ x: e.pageX, y: e.pageY })
  }

  const isNotMacOs = platform !== 'macos' && platform !== 'macos-bigsur'

  const handleCloseWindow = (e: MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur()
    bridge.window.close()
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

  const img = <div className="h-4 w-4 titlebar-icon" />

  return (
    <div
      className={cx(
        'titlebar drag',
        !isNotMacOs && 'macos',
        platform === 'macos-bigsur' && 'macos-bigsur',
        isNotMacOs && 'other-platform',
        isFocus && 'focused',
        windowState === 'maximized' && 'maximized',
      )}
    >
      {isNotMacOs && (
        <button className="btn btn-default ml-0" onClick={handleClickMenu}>
          {img}
        </button>
      )}
      {!isNotMacOs && img}
      <span className="flex-grow">{title}</span>
      <div className="flex">
        <button
          onClick={handleMinimizeWindow}
          className="titlebar-control"
          tabIndex={-1}
        >
          &#xE921;
        </button>
        {windowState === 'maximized' ? (
          <button
            onClick={handleRestoreWindow}
            className="titlebar-control"
            tabIndex={-1}
          >
            &#xE923;
          </button>
        ) : (
          <button
            onClick={handleMaximizeWindow}
            className="titlebar-control"
            tabIndex={-1}
          >
            &#xE922;
          </button>
        )}
        <button
          onClick={handleCloseWindow}
          className="titlebar-control titlebar-control-close"
          tabIndex={-1}
        >
          &#xE8BB;
        </button>
      </div>
    </div>
  )
}
