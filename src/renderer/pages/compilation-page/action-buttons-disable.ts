/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import { ScriptModel } from '../../models'

export default function buttonsDisable(
  scripts: ScriptModel[],
  hovering?: ScriptModel
): boolean {
  const hoveringIsAfterFive =
    scripts.findIndex(script => script.id === hovering?.id) >= 5

  return scripts.length > 5 && hoveringIsAfterFive
}
