import { EmptyState } from '@/components/empty-state'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { UserStatusBanner } from '@/components/user-status-banner'

export default function SettingsPage() {
  return (
    <div className="p-4 md:p-8">
      {/* Welcome Banner */}
      <UserStatusBanner variant="welcome" showOnPage="app" className="mb-6" />

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-heading-text mb-2">
          Settings
        </h1>
        <p className="text-body-text">
          Manage your account preferences and notifications
        </p>
      </div>

      <EmptyState
        title="Settings Coming Soon"
        subtitle="We're building comprehensive settings including notifications, privacy controls, and account management"
        actionButtons={
          <Link href="/profile">
            <Button className="bg-primary-cta text-white hover:bg-primary-cta/90">
              View Profile
            </Button>
          </Link>
        }
      />
    </div>
  )
} 