export interface HandlerInterface<T = unknown> {
  listen(args?: T): unknown
}
