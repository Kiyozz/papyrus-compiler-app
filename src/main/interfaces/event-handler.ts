/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

export interface EventHandler<T = unknown> {
  listen(args?: T): unknown
}
