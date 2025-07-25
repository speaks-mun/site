"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, CalendarDays, Heart, ExternalLink, User, Tag } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useApiAction } from '@/hooks/use-api-action'
import { toast } from 'sonner'
import { User as SupabaseUser } from '@supabase/supabase-js'

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

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)

  // Fetch user and check bookmark/registration status
  useEffect(() => {
    const fetchUserAndStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setUser(user)

      // Check if bookmarked
      const { data: bookmark } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', user.id)
        .eq('event_id', event.id)
        .single()

      setIsBookmarked(!!bookmark)

      // Check if registered
      const { data: registration } = await supabase
        .from('registrations')
        .select('id')
        .eq('user_id', user.id)
        .eq('event_id', event.id)
        .single()

      setIsRegistered(!!registration)
    }

    fetchUserAndStatus()
  }, [event.id])

  const { execute: handleBookmark, isLoading: bookmarkLoading } = useApiAction(
    async () => {
      if (!user) throw new Error('Please sign in to bookmark events')

      if (isBookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('event_id', event.id)

        if (error) throw error
        return { action: 'removed' }
      } else {
        // Add bookmark
        const { error } = await supabase
          .from('bookmarks')
          .insert({
            user_id: user.id,
            event_id: event.id,
            created_at: new Date().toISOString(),
          })

        if (error) throw error
        return { action: 'added' }
      }
    },
    {
      onSuccess: () => {
        if (!isBookmarked) {
          toast.success('Event bookmarked!')
        } else {
          toast.success('Bookmark removed')
        }
      },
      onError: () => {
        // Revert optimistic update
        setIsBookmarked(!isBookmarked)
      }
    }
  )

  const { execute: handleRegister, isLoading: registerLoading } = useApiAction(
    async () => {
      if (!user) throw new Error('Please sign in to register for events')
      if (isRegistered) throw new Error('Already registered for this event')

      const { error } = await supabase
        .from('registrations')
        .insert({
          user_id: user.id,
          event_id: event.id,
          created_at: new Date().toISOString(),
        })

      if (error) throw error
      return true
    },
    {
      successMessage: 'Registration recorded! Redirecting to event page...',
      onSuccess: () => {
        // Redirect to external URL after successful registration
        setTimeout(() => {
          window.open(event.redirect_url, '_blank')
        }, 1000)
      },
      onError: () => {
        // Revert optimistic update
        setIsRegistered(false)
      }
    }
  )

  const onBookmarkClick = () => {
    // Optimistic update
    setIsBookmarked(!isBookmarked)
    handleBookmark({})
  }

  const onRegisterClick = () => {
    if (isRegistered) {
      // If already registered, just redirect
      window.open(event.redirect_url, '_blank')
      return
    }

    // Optimistic update
    setIsRegistered(true)
    handleRegister({})
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-card-background border-border-divider">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-heading-text line-clamp-2">
            {event.name}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onBookmarkClick}
            disabled={bookmarkLoading}
            className="p-2 hover:bg-primary-cta/10"
          >
            <Heart 
              className={`w-4 h-4 ${isBookmarked ? 'fill-red-500 text-red-500' : 'text-body-text'}`} 
            />
          </Button>
        </div>
        
        <p className="text-sm text-body-text line-clamp-3">
          {event.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Location & Time */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-body-text">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          
          <div className="flex items-center text-sm text-body-text">
            <CalendarDays className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>
              {formatDate(event.start_date_time)} at {formatTime(event.start_date_time)}
              {event.start_date_time !== event.end_date_time && (
                <span> - {formatDate(event.end_date_time)}</span>
              )}
            </span>
          </div>
        </div>

        {/* Organizing Institution */}
        <div className="flex items-center text-sm text-body-text">
          <User className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="truncate">{event.organizing_institution}</span>
        </div>

        {/* MUN Type and Committee */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs">
            {event.mun_type}
          </Badge>
          {event.committee && (
            <Badge variant="outline" className="text-xs">
              {event.committee}
            </Badge>
          )}
        </div>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex items-start space-x-2">
            <Tag className="w-4 h-4 mt-0.5 text-body-text flex-shrink-0" />
            <div className="flex flex-wrap gap-1">
              {event.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {event.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{event.tags.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button
          onClick={onRegisterClick}
          disabled={registerLoading}
          className="flex-1 bg-primary-cta text-white hover:bg-primary-cta/90"
        >
          {registerLoading ? 'Registering...' : isRegistered ? 'Registered' : 'Register'}
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  )
} 