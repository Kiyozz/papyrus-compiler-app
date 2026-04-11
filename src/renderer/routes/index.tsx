/*
 * 2026 Kiyozz.
 */

import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({ to: '/compilation' })
  },
})
