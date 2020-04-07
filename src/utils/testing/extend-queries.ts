import { ElementNotFoundException } from './exceptions/element-not-found.exception'
import { MultipleElementsException } from './exceptions/multiple-elements.exception'

export function extendQueries(element: HTMLElement) {
  return {
    querySelector: (...args: Parameters<HTMLElement['querySelector']>) => element.querySelector(...args),
    querySelectorAll: (...args: Parameters<HTMLElement['querySelectorAll']>) => Array.from(element.querySelectorAll(...args)),
    getBySelector: (...args: Parameters<HTMLElement['querySelectorAll']>) => {
      const result = Array.from(element.querySelectorAll(...args))

      if (result.length > 1) {
        throw new MultipleElementsException(args[0], element)
      }

      if (result.length === 0) {
        throw new ElementNotFoundException(args[0], element)
      }

      return result[0] as HTMLElement
    },
    getBySelectorAll: (...args: Parameters<HTMLElement['querySelectorAll']>) => {
      return Array.from(element.querySelectorAll(...args))
    },
  }
}
