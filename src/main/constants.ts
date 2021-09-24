/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { is } from 'electron-util'

export const GITHUB_LINK = 'https://github.com/Kiyozz/papyrus-compiler-app'
export const GITHUB_ISSUES_NEW_LINK = `${GITHUB_LINK}/issues/new`
export const DEFAULT_COMPILER_PATH = `Papyrus Compiler${
  is.linux || is.macos ? '/' : '\\'
}PapyrusCompiler.exe`
