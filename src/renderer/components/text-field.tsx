/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import React, { useCallback } from 'react'

interface Props {
  autoFocus?: boolean
  name?: string
  error?: boolean
  id: string
  label?: string
  value: string
  placeholder?: string
  onChange: (value: string) => void
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
  iconOnClick
}: Props) {
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
          className={`text-xs block text-gray-300${
            error ? ' label-danger' : ''
          }`}
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <div
        className={`relative input pb-0.5 flex${error ? ' input-danger' : ''}`}
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
          autoFocus={autoFocus}
          id={id}
          name={name}
          placeholder={placeholder}
          className="w-full text-white bg-transparent"
          value={value}
          onChange={onChangeInput}
        />
      </div>
    </>
  )
}
