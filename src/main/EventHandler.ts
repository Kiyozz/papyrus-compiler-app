export interface EventHandler<T = unknown> {
  listen(args?: T): unknown
}
