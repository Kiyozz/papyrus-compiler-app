import { cn } from '@/lib/utils'
import { Slot } from '@radix-ui/react-slot'
import type { ComponentPropsWithRef } from 'react'

function Card({ className, ref, asChild = false, ...props }: ComponentPropsWithRef<'div'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'div'

  return (
    <Comp ref={ref} className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)} {...props} />
  )
}

function CardHeader({ className, ref, ...props }: ComponentPropsWithRef<'div'>) {
  return <div ref={ref} className={cn('flex flex-col gap-1.5 p-2 pb-4', className)} {...props} />
}

function CardTitle({ className, ref, ...props }: ComponentPropsWithRef<'div'>) {
  return <div ref={ref} className={cn('font-semibold text-2xl leading-none tracking-tight', className)} {...props} />
}

function CardDescription({ className, ref, ...props }: ComponentPropsWithRef<'div'>) {
  return <div ref={ref} className={cn('text-muted-foreground text-sm', className)} {...props} />
}

function CardContent({ className, ref, ...props }: ComponentPropsWithRef<'div'>) {
  return <div ref={ref} data-slot="card-content" className={cn('p-2 pt-0', className)} {...props} />
}

function CardFooter({ className, ref, ...props }: ComponentPropsWithRef<'div'>) {
  return <div ref={ref} className={cn('flex items-center p-2 pt-0', className)} {...props} />
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
