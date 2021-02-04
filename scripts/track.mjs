/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

const startedAt = Date.now()

/**
 *
 * @param {number} value
 * @param {number} fixed
 *
 * @return {string}
 */
function zeros(value, fixed) {
  const fixedValue = value.toFixed(fixed)

  if (value < 10) {
    return `00${fixedValue}`
  }

  if (value < 100) {
    return `0${fixedValue}`
  }

  return fixedValue
}

/**
 * @return {string}
 */
export function track() {
  const value = (Date.now() - startedAt) / 1000

  return `[${zeros(value, 2)}]`
}
