/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import cx from 'classnames'
import React from 'react'
import bridge from '../bridge'
import { useFocus } from '../hooks/use-focus'
import { usePlatform } from '../hooks/use-platform'
import { useTitlebarHeight } from '../hooks/use-titlebar-height'
import { useWindowState } from '../hooks/use-window-state'
import type { MouseEvent } from 'react';

interface Props {
  title: string
}

function Titlebar({ title }: Props) {
  const isFocus = useFocus()
  const platform = usePlatform()
  const windowState = useWindowState()
  const titlebarHeight = useTitlebarHeight()

  const handleClickMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur()
    bridge.titlebar.openMenu({ x: e.pageX, y: e.pageY })
  }

  const isNotMacOs = platform !== 'macos' && platform !== 'macos-bigsur'
  const isMacOs = !isNotMacOs
  const isMacOsBigSur = platform === 'macos-bigsur'

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

  const img = <div className="titlebar-icon h-4 w-4" />

  return (
    <div
      className={cx(
        'titlebar drag',
        isMacOs && 'macos',
        isMacOsBigSur && 'macos-bigsur',
        isNotMacOs && 'other-platform',
        isFocus && 'focused',
        windowState === 'maximized' && 'maximized',
      )}
      data-height={titlebarHeight}
    >
      {isNotMacOs && (
        <button className="btn btn-default ml-0" onClick={handleClickMenu}>
          {img}
        </button>
      )}

      <span
        className={cx(
          'grow',
          isMacOs && 'text-center font-helvetica font-bold',
          isMacOs && !isMacOsBigSur && 'text-[12px]',
          isMacOsBigSur && 'text-[14px]',
          isMacOs && !isFocus && 'text-[#6b6769]',
        )}
      >
        {title}
      </span>
      {isNotMacOs && (
        <div className="flex">
          <button
            className="titlebar-control"
            onClick={handleMinimizeWindow}
            tabIndex={-1}
          >
            &#xE921;
          </button>
          {windowState === 'maximized' ? (
            <button
              className="titlebar-control"
              onClick={handleRestoreWindow}
              tabIndex={-1}
            >
              &#xE923;
            </button>
          ) : (
            <button
              className="titlebar-control"
              onClick={handleMaximizeWindow}
              tabIndex={-1}
            >
              &#xE922;
            </button>
          )}
          <button
            className="titlebar-control titlebar-control-close"
            onClick={handleCloseWindow}
            tabIndex={-1}
          >
            &#xE8BB;
          </button>
        </div>
      )}
    </div>
  )
}

export default Titlebar
