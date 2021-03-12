/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import React, { useCallback } from 'react'

interface Props {
  autoFocus?: boolean
  name?: string
  error?: boolean
  id: string
  label?: string
  value: string | number
  placeholder?: string
  infoText?: string
  inputClassName?: string
  onChange: (value: string | number) => void
  startIcon?: JSX.Element
  iconOnMouseEnter?: () => void
  iconOnMouseLeave?: () => void
  iconOnClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export function TextField({
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
  infoText
}: Props): JSX.Element {
  const onChangeInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.currentTarget.value

      onChange(newValue)
    },
    [onChange]
  )

  return (
    <>
      {label && (
        <label
          className={`text-xs block text-gray-300 ${
            error ? 'label-danger' : ''
          }`}
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <div
        className={`relative text-sm input pb-0.5 flex${
          error ? ' input-danger' : ''
        }`}
      >
        {startIcon && (
          <div
            className="text-white mr-2 cursor-pointer"
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
          className={`w-full text-white bg-transparent ${inputClassName}`}
          value={value}
          onChange={onChangeInput}
        />
      </div>
      {is.string(infoText) && (
        <div className="text-xs mt-1 text-gray-600">{infoText}</div>
      )}
    </>
  )
}
