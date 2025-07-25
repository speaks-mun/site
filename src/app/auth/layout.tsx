import { AuthLayout } from '@/components/layout/auth-layout'

export default function AuthPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthLayout>{children}</AuthLayout>
} 