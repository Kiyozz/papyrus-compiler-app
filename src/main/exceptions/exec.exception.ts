/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

export interface ExecException extends Error {
  stderr: string
  stdout: string
}
