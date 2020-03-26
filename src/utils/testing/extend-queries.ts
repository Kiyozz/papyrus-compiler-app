import { getNodeText } from '@testing-library/react'

export function extendQueries(element: HTMLElement) {
  return {
    querySelector: (...args: Parameters<HTMLElement['querySelector']>) => element.querySelector(...args),
    querySelectorAll: (...args: Parameters<HTMLElement['querySelectorAll']>) => Array.from(element.querySelectorAll(...args)),
    getBySelector: (...args: Parameters<HTMLElement['querySelectorAll']>) => {
      const result = Array.from(element.querySelectorAll(...args))

      if (result.length > 1) {
        throw new Error(`Unable to find an element with the selector: "${args[0]}". This could be because the selector is broken up by multiple elements. Use getBySelectorAll instead.`)
      }

      if (result.length === 0) {
        throw new Error(`Unable to find an element with the selector: "${args[0]}". Element not found: ${getNodeText(element)}`)
      }

      return result[0] as HTMLElement
    },
    getBySelectorAll: (...args: Parameters<HTMLElement['querySelectorAll']>) => {
      return Array.from(element.querySelectorAll(...args))
    },
  }
}
