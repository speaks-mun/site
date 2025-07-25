"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, ArrowRight, MapIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useApiAction } from '@/hooks/use-api-action'
import { User as SupabaseUser } from '@supabase/supabase-js'

const eventSchema = z.object({
  name: z.string().min(5, 'Event name must be at least 5 characters').max(100),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000),
  location: z.string().min(1, 'Venue name is required'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  start_date: z.string().min(1, 'Start date is required'),
  start_time: z.string().min(1, 'Start time is required'),
  end_date: z.string().min(1, 'End date is required'),
  end_time: z.string().min(1, 'End time is required'),
  organizing_institution: z.string().min(1, 'Organizing institution is required'),
  mun_type: z.enum(['Conference', 'Workshop', 'Simulation']).refine((val) => val !== undefined, {
    message: 'Please select a MUN type',
  }),
  committee: z.string().optional(),
  tags: z.string().optional(),
  redirect_url: z.string().url('Please enter a valid URL'),
  contact_info: z.string().min(1, 'Contact info is required'),
}).refine((data) => {
  const start = new Date(`${data.start_date}T${data.start_time}`)
  const end = new Date(`${data.end_date}T${data.end_time}`)
  return end > start
}, {
  message: "End date and time must be after start date and time",
  path: ["end_date"]
}).refine((data) => {
  const start = new Date(`${data.start_date}T${data.start_time}`)
  return start > new Date()
}, {
  message: "Event must be in the future",
  path: ["start_date"]
})

type EventFormData = z.infer<typeof eventSchema>

const STEPS = [
  { title: 'Basic Info', description: 'Event name and description' },
  { title: 'Location & Time', description: 'When and where' },
  { title: 'Details', description: 'Organization and type' },
  { title: 'Final Details', description: 'Tags and contact' },
]

export default function CreateEventPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: '',
      description: '',
      location: '',
      latitude: 0,
      longitude: 0,
      start_date: '',
      start_time: '',
      end_date: '',
      end_time: '',
      organizing_institution: '',
      mun_type: 'Conference',
      committee: '',
      tags: '',
      redirect_url: '',
      contact_info: '',
    },
  })

  // Check user authentication and organizer status
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      // Check if user is an organizer
      const { data: userData } = await supabase
        .from('users')
        .select('is_organizer')
        .eq('id', user.id)
        .single()

      if (!userData?.is_organizer) {
        router.push('/discover')
        return
      }

      setUser(user)
      setLoading(false)
    }

    checkUser()
  }, [router])

  const { execute: handleSubmit, isLoading: isSubmitting } = useApiAction(
    async (data: EventFormData) => {
      if (!user) throw new Error('No user found')

      const { error } = await supabase
        .from('events')
        .insert({
          name: data.name,
          description: data.description,
          location: data.location,
          latitude: data.latitude,
          longitude: data.longitude,
          start_date_time: `${data.start_date}T${data.start_time}:00`,
          end_date_time: `${data.end_date}T${data.end_time}:00`,
          organizing_institution: data.organizing_institution,
          mun_type: data.mun_type,
          committee: data.committee || null,
          tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : null,
          redirect_url: data.redirect_url,
          contact_info: data.contact_info,
          organizer_id: user.id,
          is_public: true,
          status: 'live',
          created_at: new Date().toISOString(),
        })

      if (error) throw error
      return true
    },
    {
      successMessage: "Event created successfully!",
      onSuccess: () => {
        router.push('/discover')
      },
    }
  )

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        form.setValue('latitude', position.coords.latitude)
        form.setValue('longitude', position.coords.longitude)
      },
      (error) => {
        console.error('Error getting location:', error)
        alert('Unable to get your current location. Please enter coordinates manually.')
      }
    )
  }

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = (data: EventFormData) => {
    handleSubmit(data)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-cta mx-auto mb-4"></div>
          <p className="text-body-text">Loading...</p>
        </div>
      </div>
    )
  }

  const progress = ((currentStep + 1) / STEPS.length) * 100

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-heading-text mb-2">
            Create MUN Event
          </h1>
          <p className="text-body-text">
            Share your Model United Nations event with the community
          </p>
        </div>

        {/* Progress */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-body-text">
                  Step {currentStep + 1} of {STEPS.length}
                </span>
                <span className="text-primary-cta font-medium">
                  {Math.round(progress)}% Complete
                </span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="text-center">
                <h3 className="font-semibold text-heading-text">
                  {STEPS[currentStep].title}
                </h3>
                <p className="text-sm text-body-text">
                  {STEPS[currentStep].description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Step 1: Basic Info */}
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-heading-text">Event Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., IIMUN 2024 - International Conference" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-heading-text">Description *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your MUN event, including themes, committees, and what participants can expect..."
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 2: Location & Time */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-heading-text">Venue Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., IIM Bangalore, Main Auditorium" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="latitude"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-heading-text">Latitude *</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="any"
                                placeholder="12.9716"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="longitude"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-heading-text">Longitude *</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="any"
                                placeholder="77.5946"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={getCurrentLocation}
                      className="w-full"
                    >
                      <MapIcon className="w-4 h-4 mr-2" />
                      Use Current Location
                    </Button>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="start_date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-heading-text">Start Date *</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="start_time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-heading-text">Start Time *</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="end_date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-heading-text">End Date *</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="end_time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-heading-text">End Time *</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Details */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="organizing_institution"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-heading-text">Organizing Institution *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Indian Institute of Management, Bangalore" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mun_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-heading-text">MUN Type *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select MUN type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Conference">Conference</SelectItem>
                              <SelectItem value="Workshop">Workshop</SelectItem>
                              <SelectItem value="Simulation">Simulation</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="committee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-heading-text">Committee (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., UNSC, ECOSOC, WHO" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 4: Final Details */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-heading-text">Tags (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., International Relations, Diplomacy, Youth"
                              {...field} 
                            />
                          </FormControl>
                          <p className="text-xs text-body-text">
                            Separate tags with commas
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="redirect_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-heading-text">Registration URL *</FormLabel>
                          <FormControl>
                            <Input 
                              type="url"
                              placeholder="https://your-registration-page.com"
                              {...field} 
                            />
                          </FormControl>
                          <p className="text-xs text-body-text">
                            Where participants will be redirected to register
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contact_info"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-heading-text">Contact Information *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Email: contact@event.com&#10;Phone: +91 12345 67890&#10;WhatsApp: +91 98765 43210"
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="flex items-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  {currentStep < STEPS.length - 1 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="flex items-center bg-primary-cta text-white hover:bg-primary-cta/90"
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-primary-cta text-white hover:bg-primary-cta/90"
                    >
                      {isSubmitting ? "Creating Event..." : "Create Event"}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 