import { twMerge } from 'tailwind-merge'

export function cn(...inputs: Parameters<typeof twMerge>) {
  return twMerge(inputs)
}
