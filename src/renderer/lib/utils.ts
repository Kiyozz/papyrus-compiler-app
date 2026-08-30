/*
 * 2026 Kiyozz.
 */

import { type ClassNameValue, twMerge } from 'tailwind-merge'

type StateClassName<State> = (state: State) => string | undefined

// Base UI accepts `className` either as a string or as a function of the part
// state: merging one into a wrapper's own classes has to keep that shape, so
// cn returns a function as soon as one of its inputs is one
export function cn(...inputs: ClassNameValue[]): string
export function cn<State>(
  ...inputs: (ClassNameValue | StateClassName<State>)[]
): StateClassName<State>
export function cn<State>(
  ...inputs: (ClassNameValue | StateClassName<State>)[]
): string | StateClassName<State> {
  if (!inputs.some((input) => typeof input === 'function')) {
    return twMerge(inputs as ClassNameValue[])
  }

  return (state: State) =>
    twMerge(
      inputs.map((input) =>
        typeof input === 'function' ? input(state) : input,
      ) as ClassNameValue[],
    )
}
