/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

function deepChildren(element?: HTMLElement | ChildNode | null): ChildNode[] {
  if (element === undefined || element === null) {
    return []
  }

  let children = Array.from(element.childNodes)

  if (children.length > 0) {
    let childNotesDeep: ChildNode[] = []

    for (const child of children) {
      childNotesDeep = [...childNotesDeep, ...deepChildren(child)]
    }

    children = [...children, ...childNotesDeep]
  }

  return children
}

export function isChildren(
  from: HTMLElement | ChildNode | undefined | null,
  child: HTMLElement | null,
): boolean {
  if (child === null) {
    return false
  }

  return deepChildren(from).includes(child)
}
