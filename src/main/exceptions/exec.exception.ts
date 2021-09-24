/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

export interface ExecException extends Error {
  stderr: string
  stdout: string
}
