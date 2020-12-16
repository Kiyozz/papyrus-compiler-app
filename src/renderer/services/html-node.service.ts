/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'

export class HtmlNodeService {
  isChildren(
    from: HTMLElement | ChildNode | undefined | null,
    child: HTMLElement
  ): boolean {
    return this.deepChilds(from).includes(child)
  }

  deepChilds(element?: HTMLElement | ChildNode | null): ChildNode[] {
    if (is.nullOrUndefined(element)) {
      return []
    }

    let childs = Array.from(element.childNodes)

    if (childs.length > 0) {
      let childNotesDeep: ChildNode[] = []

      for (const child of childs) {
        childNotesDeep = [...childNotesDeep, ...this.deepChilds(child)]
      }

      childs = [...childs, ...childNotesDeep]
    }

    return childs
  }
}
