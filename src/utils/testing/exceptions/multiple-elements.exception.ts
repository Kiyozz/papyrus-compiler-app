import { prettyDOM } from '@testing-library/react'

export class MultipleElementsException extends Error {
  constructor(selector: string, element: HTMLElement) {
    super(`Unable to find an element with the selector: "${selector}". This could be because the selector is broken up by multiple elements. Use getBySelectorAll instead.\n\n${prettyDOM(element)}`)
  }
}
