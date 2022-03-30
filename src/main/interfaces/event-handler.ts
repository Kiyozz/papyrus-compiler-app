/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

export interface EventHandler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listen: (args: any) => unknown | Promise<unknown>
}
