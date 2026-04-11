/*
 * 2022-2026 Kiyozz.
 */

export interface EventHandler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listen: (args: any) => unknown | Promise<unknown>
}
