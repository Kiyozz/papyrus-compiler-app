import { fireEvent } from '@testing-library/react'

export function fireEventChange(element: HTMLElement, value: string) {
  fireEvent.change(element, { target: { value } })
}
