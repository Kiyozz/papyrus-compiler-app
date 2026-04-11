/*
 * 2026 Kiyozz.
 */

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@renderer/components/ui/dialog.tsx'
import type { PropsWithChildren } from 'react'
import { Button } from '@renderer/components/ui/button.tsx'

export function DialogDocumentation({ children }: PropsWithChildren) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="flex dialog-fullscreen-height grow max-w-screen flex-col px-0 sm:max-w-screen rounded-none"
        aria-describedby={undefined}
      >
        <DialogHeader className="px-6">
          <DialogTitle>Documentation</DialogTitle>
        </DialogHeader>
        <div className="px-6 grow">Documentation</div>
        <DialogFooter className="px-6 sm:justify-start">
          <div className="flex w-full flex-col-reverse sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
