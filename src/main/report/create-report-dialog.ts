/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import { app, dialog, shell } from 'electron'
import { ReportData } from 'electron-log'

import { GITHUB_ISSUES_NEW } from '../constants'

export function createReportDialog(
  error: Error,
  versions?: { app: string; electron: string; os: string },
  submitIssue?: (url: string, data: ReportData | unknown) => void
): void {
  const message = error.message.split('\n').map(s => s.trim())
  const stack = error.stack?.split('\n').map(s => s.trim())

  dialog
    .showMessageBox({
      title: 'An error occurred',
      message: message.join('\n\n'),
      detail: stack?.join('\n\n'),
      type: 'error',
      buttons: ['Ignore', 'Report', 'Exit']
    })
    .then(result => {
      if (result.response === 1) {
        const labels = ['bug']

        if (!is.undefined(versions)) {
          labels.push(`v${versions.app}`)
        }

        if (!is.undefined(submitIssue)) {
          submitIssue(GITHUB_ISSUES_NEW, {
            title: `Error report for ${versions?.app ?? '"Type the version"'}`,
            body: `Error:\n\`\`\`\n${message.join('\n\n')}\n\n${
              stack?.join('\n\n') ?? ''
            }\n\`\`\`\n`,
            labels,
            assignee: ['Kiyozz']
          })
        } else {
          shell.openExternal(
            `${GITHUB_ISSUES_NEW}?title=Error report&labels=${labels.join(
              ','
            )}&assignee=Kiyozz&body=Error: %0A \`\`\`%0A ${message.join(
              '%0A%0A'
            )}%0A%0A${stack?.join('%0A%0A') ?? ''}%0A \`\`\`\n`
          )
        }
      }

      if (result.response === 2) {
        app.quit()
      }
    })
}
