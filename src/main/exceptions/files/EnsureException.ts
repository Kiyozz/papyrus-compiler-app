export default class EnsureException extends Error {
  constructor(item: string) {
    super(`"${item}" cannot be created.`)
  }
}
