import { createFileRoute } from '@tanstack/react-router'
import { CompilationPage } from '../pages/compilation/compilation-page'

export const Route = createFileRoute('/compilation')({
  component: CompilationPage,
})
