export class MultipleElementsException extends Error {
  constructor(selector: string) {
    super(`Unable to find an element with the selector: "${selector}". This could be because the selector is broken up by multiple elements. Use getBySelectorAll instead.`)
  }
}
