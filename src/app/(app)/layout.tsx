import { AppLayout } from '@/components/layout/app-layout'
import { ErrorBoundary } from '@/components/error-boundary'

export default function AppPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary>
      <AppLayout>{children}</AppLayout>
    </ErrorBoundary>
  )
} 