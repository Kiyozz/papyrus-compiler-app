import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.tsx'
import type { PropsWithChildren } from 'react'

export function DialogDocumentation({ children }: PropsWithChildren) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex h-full max-w-screen flex-col px-0 sm:max-w-screen">
        <DialogHeader aria-describedby={undefined} className="px-6">
          <DialogTitle>Documentation</DialogTitle>
        </DialogHeader>
        <div className="px-6">Documentation</div>
        <DialogFooter className="px-6 sm:justify-start">
          <div className="flex w-full flex-col-reverse sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <button>Close</button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
