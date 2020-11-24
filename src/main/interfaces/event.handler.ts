/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

export interface EventHandler<T = unknown> {
  listen(args?: T): unknown
}
