/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

export interface EventHandler<T = unknown> {
  listen(args?: T): unknown
}
