"use client"

import { useState, useEffect, useCallback, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { EventCard } from '@/components/event-card'
import { supabase } from '@/lib/supabase/client'
import { MapPin, List, Filter } from 'lucide-react'
import { UserStatusBanner } from '@/components/user-status-banner'
import { CondensedFilterBar } from '@/components/discovery/condensed-filter-bar'

// Placeholder map component until Google Maps API is configured
const MapPlaceholder = ({ events }: { events: Event[] }) => (
  <div className="w-full h-full bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center relative overflow-hidden">
    {/* Background pattern */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-primary-cta rounded-full"></div>
      <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-primary-cta rounded-full"></div>
      <div className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-primary-cta rounded-full"></div>
      <div className="absolute bottom-1/4 right-1/4 w-10 h-10 bg-primary-cta rounded-full"></div>
    </div>
    
    <div className="text-center z-10">
      <MapPin className="w-16 h-16 text-primary-cta mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-heading-text mb-2">
        Interactive Map Coming Soon
      </h3>
      <p className="text-body-text mb-4 max-w-md">
                 We&apos;re setting up Google Maps integration to show {events.length} MUN events across South India
      </p>
      <div className="flex justify-center space-x-2">
        <div className="w-2 h-2 bg-primary-cta rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-primary-cta rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-primary-cta rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  </div>
)

interface Event {
  id: string
  name: string
  description: string
  location: string
  latitude: number
  longitude: number
  start_date_time: string
  end_date_time: string
  organizing_institution: string
  mun_type: string
  committee?: string
  tags?: string[]
  redirect_url: string
  contact_info: string
  is_public: boolean
  organizer_id: string
}

export default function DiscoverPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [showMap, setShowMap] = useState(true)
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)

  const fetchEvents = useCallback(async (offsetValue = 0, reset = false) => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_public', true)
        .order('start_date_time', { ascending: true })
        .range(offsetValue, offsetValue + 19) // Fetch 20 events at a time

      if (error) throw error

      if (reset) {
        setEvents(data || [])
      } else {
        setEvents(prev => [...prev, ...(data || [])])
      }
      
      setHasMore((data || []).length === 20)
      setOffset(offsetValue + 20)
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEvents(0, true)
  }, [fetchEvents])

  const toggleView = () => {
    setShowMap(!showMap)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Welcome Banner */}
      <div className="p-4 pb-0">
        <UserStatusBanner variant="welcome" showOnPage="app" />
      </div>

      {/* Map Section */}
      {showMap && (
        <div className="h-[40vh] md:h-[60vh] w-full relative">
          <MapPlaceholder events={events} />
        </div>
      )}

      {/* Toggle Button */}
      <Button
        onClick={toggleView}
        className="fixed bottom-20 right-4 md:right-8 z-40 bg-primary-cta text-white hover:bg-primary-cta/90 rounded-full p-4 shadow-lg"
        size="lg"
      >
        {showMap ? (
          <>
            <List className="w-5 h-5 mr-2" />
            View Events
          </>
        ) : (
          <>
            <MapPin className="w-5 h-5 mr-2" />
            View Map
          </>
        )}
      </Button>

      {/* Events Section */}
      <div className="p-4 md:p-8">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-heading-text mb-2">
            Discover MUN Events
          </h2>
          <p className="text-body-text">
            Find and register for Model United Nations conferences across South India
          </p>
        </div>

        {/* Condensed Filter Bar */}
        <div className="mb-6">
          <CondensedFilterBar />
        </div>

        {/* Events Grid */}
        {loading && events.length === 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-card-background rounded-lg p-6 space-y-4">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-5/6"></div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-8 bg-muted rounded w-20"></div>
                    <div className="h-8 bg-muted rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-heading-text mb-2">
              No events found
            </h3>
            <p className="text-body-text">
              Check back later for upcoming MUN events
            </p>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && events.length > 0 && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={() => fetchEvents(offset)}
              disabled={loading}
              variant="outline"
              className="px-8 py-2"
            >
              {loading ? "Loading..." : "Load More Events"}
            </Button>
          </div>
        )}

        {!hasMore && events.length > 0 && (
          <div className="text-center mt-8">
            <p className="text-body-text">No more events to load</p>
          </div>
        )}
      </div>
    </div>
  )
} 