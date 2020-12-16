/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

export interface EventHandlerInterface<T = unknown> {
  listen(args?: T): unknown
}
