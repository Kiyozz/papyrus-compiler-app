import { getNodeText } from "@testing-library/react";

export class ElementNotFoundException extends Error {
  constructor(selector: string, element: HTMLElement) {
    super(`Unable to find an element with the selector: "${selector}". Element not found: ${getNodeText(element)}`)
  }
}
