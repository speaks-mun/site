import { AppLayout } from '@/components/layout/app-layout'

export default function AppPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppLayout>{children}</AppLayout>
} 