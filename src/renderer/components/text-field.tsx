/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import cx from 'classnames'
import React, { useCallback } from 'react'
import type { ReactNode} from 'react';

interface Props {
  autoFocus?: boolean
  name?: string
  error?: boolean
  id: string
  label?: ReactNode
  value: string | number
  placeholder?: string
  infoText?: string
  inputClassName?: string
  onChange: (value: string | number) => void
  startIcon?: ReactNode
  iconOnMouseEnter?: () => void
  iconOnMouseLeave?: () => void
  iconOnClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

function TextField({
  autoFocus,
  name,
  error,
  id,
  label,
  onChange,
  value,
  placeholder,
  startIcon,
  iconOnMouseEnter,
  iconOnMouseLeave,
  iconOnClick,
  inputClassName = '',
  infoText,
}: Props) {
  const onChangeInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.currentTarget.value

      onChange(newValue)
    },
    [onChange],
  )

  return (
    <>
      {label && (
        <label
          className={cx(
            'flex items-center text-black-600 dark:text-gray-300',
            error && 'label-danger',
          )}
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <div
        className={cx('input relative flex pb-0.5', error && 'input-danger')}
      >
        {startIcon && (
          <div
            className="mr-2 cursor-pointer text-black-600 dark:text-white"
            onClick={iconOnClick}
            onMouseEnter={iconOnMouseEnter}
            onMouseLeave={iconOnMouseLeave}
          >
            {startIcon}
          </div>
        )}
        <input
          autoFocus={autoFocus}
          className={cx(
            'w-full bg-transparent text-black-600 dark:text-white',
            inputClassName,
          )}
          id={id}
          name={name}
          onChange={onChangeInput}
          placeholder={placeholder}
          spellCheck={false}
          value={value}
        />
      </div>
      {is.string(infoText) && (
        <div className="mt-1 text-sm text-black-600 dark:text-light-800">
          {infoText}
        </div>
      )}
    </>
  )
}

export default TextField
