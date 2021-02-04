/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

export interface EventHandlerInterface<T = unknown> {
  listen(args?: T): unknown
}
