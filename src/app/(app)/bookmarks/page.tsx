import { EmptyState } from '@/components/empty-state'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function BookmarksPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-heading-text mb-2">
          Bookmarked Events
        </h1>
        <p className="text-body-text">
          Your saved MUN events for quick access
        </p>
      </div>

      <EmptyState
        title="No bookmarks yet"
        subtitle="Start bookmarking events you're interested in to see them here"
        actionButtons={
          <Link href="/discover">
            <Button className="bg-primary-cta text-white hover:bg-primary-cta/90">
              Discover Events
            </Button>
          </Link>
        }
      />
    </div>
  )
} 