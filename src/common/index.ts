export * from './game'
export * from './slash'
import * as EVENTS from './events'
import * as CONSTANTS from './constants'

export { EVENTS }
export { CONSTANTS }
export type { AppStore } from './appStore'
export * from './interfaces/Config'
export * from './interfaces/Group'
export * from './interfaces/Script'
export type { PartialDeep } from 'type-fest'
export type { Stats } from 'fs-extra'
export const GITHUB_LINK = 'http://github.com/Kiyozz/papyrus-compiler-app'
export const GITHUB_ISSUES_NEW = `${GITHUB_LINK}/issues/new`
