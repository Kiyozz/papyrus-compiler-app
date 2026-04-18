/*
 * 2026 Kiyozz.
 */

import { BrowserWindow } from 'electron'
import { inject } from '#main/inject.ts'

@inject()
export class MainBrowserWindow extends BrowserWindow {}
