import { prettyDOM } from "@testing-library/dom";

export class ElementNotFoundException extends Error {
  constructor(selector: string, element: HTMLElement) {
    super(`Unable to find an element with the selector: "${selector}".\n\n${prettyDOM(element)}`)
  }
}
