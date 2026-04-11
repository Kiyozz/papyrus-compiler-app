import { Button } from '@renderer/components/ui/button.tsx'
import { Card, CardContent, CardHeader } from '@renderer/components/ui/card.tsx'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@renderer/components/ui/dialog.tsx'
import { ScrollArea } from '@renderer/components/ui/scroll-area.tsx'
import { useApp } from '@renderer/hooks/use-app.tsx'
import { useCompilation } from '@renderer/hooks/use-compilation.tsx'
import { useTelemetry } from '@renderer/hooks/use-telemetry.tsx'
import { logsState } from '@renderer/lib/logs.ts'
import {
  isFailedScript,
  isSuccessScript,
} from '@renderer/utils/scripts/status.ts'
import { CheckCheckIcon, CircleXIcon, CopyIcon, FileXIcon } from 'lucide-react'
import type { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { TelemetryEvent } from '../../../common/telemetry-event.ts'

export function DialogCompilationLogs({ children }: PropsWithChildren) {
  const { t } = useTranslation()
  const { logs, clearCompilationLogs } = useCompilation()
  const { hasNoLogs, hasErrorsInLogs, isAllScriptsSuccessInLogs } =
    logsState(logs)
  const { send } = useTelemetry()
  const { copyToClipboard } = useApp()

  const onClickClearLogs = () => {
    clearCompilationLogs()
  }

  let compilationState = 'running'

  if (isAllScriptsSuccessInLogs) {
    compilationState = 'success'
  } else if (hasErrorsInLogs) {
    compilationState = 'error'
  }

  return (
    <Dialog>
      <DialogTrigger
        asChild
        data-state={compilationState}
        className="data-[state=error]:text-destructive data-[state=success]:text-green-500 data-[state=error]:[&_button]:hover:bg-destructive data-[state=success]:[&_button]:hover:bg-green-700 data-[state=error]:[&_button]:hover:text-destructive-foreground"
      >
        {children}
      </DialogTrigger>
      <DialogContent
        className="flex h-full max-w-screen flex-col px-0 sm:max-w-screen"
        aria-describedby={undefined}
      >
        <DialogHeader aria-describedby={undefined} className="drag px-6">
          <DialogTitle>{t('common.logs.title')}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="[&_[data-radix-scroll-area-viewport]>div]:block! w-full grow [&_[data-radix-scroll-area-viewport]>div]:min-h-auto!">
          {hasNoLogs ? (
            <p className="flex h-full items-center justify-center">
              {t('common.logs.noLogs')}
            </p>
          ) : (
            <div className="px-6">
              <ul className="flex flex-col gap-4">
                {logs.map(([script, log]) => {
                  const isSuccess = isSuccessScript(script)
                  const isFailed = isFailedScript(script)

                  const onClickCopy = () => {
                    send(TelemetryEvent.compilationLogsCopy, {})
                    copyToClipboard(`${script.name}-${script.path}\n\n${log}\n`)
                    toast.info(t('common.logs.successCopy'), {
                      duration: Infinity,
                    })
                  }

                  const onClickDelete = () => {
                    clearCompilationLogs(script)
                  }

                  return (
                    <Card
                      key={script.id}
                      className="group flex flex-col border-6 border-accent border-t-2 border-b-[7px] bg-accent dark:border-border"
                      data-state={
                        isSuccess ? 'success' : isFailed ? 'error' : 'running'
                      }
                      asChild
                    >
                      <li>
                        <CardHeader className="sticky top-0 z-10 w-full flex-row items-center bg-accent p-1 text-accent-foreground">
                          <div className="flex items-center gap-2">
                            <CheckCheckIcon className="hidden size-4 text-green-500 group-data-[state=success]:flex" />
                            <CircleXIcon className="hidden size-4 text-destructive group-data-[state=error]:flex" />
                            <span className="truncate font-mono text-sm">
                              {script.name}
                            </span>
                          </div>
                          <div className="flex grow items-center justify-end gap-2">
                            <Button
                              size="icon-sm"
                              className="size-6"
                              variant="ghost"
                              onClick={onClickCopy}
                            >
                              <CopyIcon className="size-3.5" />
                            </Button>
                            <Button
                              size="icon-sm"
                              className="size-6"
                              variant="ghost"
                              onClick={onClickDelete}
                            >
                              <FileXIcon className="size-3.5" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent
                          className="mx-px select-text rounded-b-sm bg-card p-2 leading-4"
                          role="log"
                        >
                          <code>
                            {log.split('\n').map((log, i) => {
                              /* eslint-disable react/no-array-index-key */
                              return (
                                <span
                                  className="select-text break-words text-justify font-mono text-xs"
                                  key={i}
                                >
                                  {log}
                                  <br />
                                </span>
                              )
                              /* eslint-enable react/no-array-index-key */
                            })}
                          </code>
                        </CardContent>
                      </li>
                    </Card>
                  )
                })}
              </ul>
            </div>
          )}
        </ScrollArea>
        <DialogFooter className="px-6 sm:justify-start">
          <Button disabled={hasNoLogs} onClick={onClickClearLogs}>
            <FileXIcon />
            <span>{t('common.clear')}</span>
          </Button>
          <div className="flex w-full flex-col-reverse sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button>{t('common.cancel')}</Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
