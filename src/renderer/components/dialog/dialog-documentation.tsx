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
import type { ReactElement } from 'react'
import { Button } from '@renderer/components/ui/button.tsx'

export function DialogDocumentation({ children }: { children: ReactElement }) {
  return (
    <Dialog>
      <DialogTrigger render={children} />
      <DialogContent className="px-0" aria-describedby={undefined}>
        <DialogHeader className="px-6">
          <DialogTitle>Documentation</DialogTitle>
        </DialogHeader>
        <div className="px-6 grow">Documentation</div>
        <DialogFooter className="px-6 sm:justify-start">
          <div className="flex w-full flex-col-reverse sm:flex-row sm:justify-end">
            <DialogClose render={<Button />}>Close</DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
