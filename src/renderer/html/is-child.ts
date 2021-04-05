/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

function deepChilds(element?: HTMLElement | ChildNode | null): ChildNode[] {
  if (element === undefined || element === null) {
    return []
  }

  let childs = Array.from(element.childNodes)

  if (childs.length > 0) {
    let childNotesDeep: ChildNode[] = []

    for (const child of childs) {
      childNotesDeep = [...childNotesDeep, ...deepChilds(child)]
    }

    childs = [...childs, ...childNotesDeep]
  }

  return childs
}

export function isChildren(
  from: HTMLElement | ChildNode | undefined | null,
  child: HTMLElement | null
): boolean {
  if (child === null) {
    return false
  }

  return deepChilds(from).includes(child)
}
