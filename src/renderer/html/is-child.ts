/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

const getDeepChildren = (
  element?: HTMLElement | ChildNode | null,
): ChildNode[] => {
  if (element === undefined || element === null) {
    return []
  }

  let children = Array.from(element.childNodes)

  if (children.length > 0) {
    let childNotesDeep: ChildNode[] = []

    for (const child of children) {
      childNotesDeep = [...childNotesDeep, ...getDeepChildren(child)]
    }

    children = [...children, ...childNotesDeep]
  }

  return children
}

export const isChildren = (
  from: HTMLElement | ChildNode | undefined | null,
  child: HTMLElement | null,
) => {
  if (child === null) {
    return false
  }

  return getDeepChildren(from).includes(child)
}
