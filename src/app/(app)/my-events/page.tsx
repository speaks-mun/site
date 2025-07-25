import { EmptyState } from '@/components/empty-state'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function MyEventsPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-heading-text mb-2">
          My Events
        </h1>
        <p className="text-body-text">
          Events you&apos;ve created and registered for
        </p>
      </div>

      <EmptyState
        title="No events yet"
        subtitle="Create your first event or register for existing ones to see them here"
        actionButtons={
          <>
            <Link href="/discover">
              <Button variant="outline" className="border-primary-cta text-primary-cta hover:bg-primary-cta hover:text-white">
                Discover Events
              </Button>
            </Link>
            <Link href="/create-event/invite">
              <Button className="bg-primary-cta text-white hover:bg-primary-cta/90">
                Create Event
              </Button>
            </Link>
          </>
        }
      />
    </div>
  )
} 