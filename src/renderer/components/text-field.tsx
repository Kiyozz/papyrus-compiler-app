/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import cx from 'classnames'
import React, { ReactNode, useCallback } from 'react'

type Props = {
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

const TextField = ({
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
}: Props) => {
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
        className={cx('relative input pb-0.5 flex', error && 'input-danger')}
      >
        {startIcon && (
          <div
            className="text-black-600 dark:text-white mr-2 cursor-pointer"
            onMouseEnter={iconOnMouseEnter}
            onMouseLeave={iconOnMouseLeave}
            onClick={iconOnClick}
          >
            {startIcon}
          </div>
        )}
        <input
          spellCheck={false}
          autoFocus={autoFocus}
          id={id}
          name={name}
          placeholder={placeholder}
          className={cx(
            'w-full text-black-600 dark:text-white bg-transparent',
            inputClassName,
          )}
          value={value}
          onChange={onChangeInput}
        />
      </div>
      {is.string(infoText) && (
        <div className="text-sm mt-1 text-black-600 dark:text-light-800">
          {infoText}
        </div>
      )}
    </>
  )
}

export default TextField
