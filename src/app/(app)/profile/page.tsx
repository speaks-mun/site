import { EmptyState } from '@/components/empty-state'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ProfilePage() {
  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-heading-text mb-2">
          Your Profile
        </h1>
        <p className="text-body-text">
          Manage your account and view your MUN activity
        </p>
      </div>

      <EmptyState
        title="Profile Coming Soon"
        subtitle="We're working on a comprehensive profile experience with event history, achievements, and more"
        actionButtons={
          <Link href="/discover">
            <Button className="bg-primary-cta text-white hover:bg-primary-cta/90">
              Explore Events
            </Button>
          </Link>
        }
      />
    </div>
  )
} 