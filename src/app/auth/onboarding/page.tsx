"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { supabase } from '@/lib/supabase/client'
import { useApiAction } from '@/hooks/use-api-action'
import { User } from '@supabase/supabase-js'

const onboardingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone_number: z.string().optional(),
  college_affiliation: z.string().optional(),
  year_of_study: z.string().optional(),
  interests: z.string().min(1, 'Please enter at least one interest'),
})

type OnboardingFormData = z.infer<typeof onboardingSchema>

export default function OnboardingPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      name: '',
      phone_number: '',
      college_affiliation: '',
      year_of_study: '',
      interests: '',
    },
  })

  // Fetch current user and pre-fill form
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      setUser(user)
      
      // Pre-fill form with user data
      form.setValue('name', user.user_metadata?.full_name || user.email?.split('@')[0] || '')
      
      setLoading(false)
    }

    fetchUser()
  }, [form, router])

  const { execute: handleSubmit, isLoading: isSubmitting } = useApiAction(
    async (data: OnboardingFormData) => {
      if (!user) throw new Error('No user found')

      // Insert or update user in our database
      const { error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email!,
          name: data.name,
          profile_picture_url: user.user_metadata?.avatar_url || null,
          phone_number: data.phone_number || null,
          college_affiliation: data.college_affiliation || null,
          year_of_study: data.year_of_study || null,
          interests: data.interests,
          onboarding_completed: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

      if (error) throw error
      return true
    },
    {
      successMessage: "Profile completed successfully!",
      onSuccess: () => {
        router.push('/discover')
      },
    }
  )

  const onSubmit = (data: OnboardingFormData) => {
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-primary-cta rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-heading-text text-2xl font-bold">Speaks</span>
          </div>

          <h2 className="text-3xl font-bold text-heading-text mb-4">
            Complete Your Profile
          </h2>
          <p className="text-body-text text-lg mb-8">
            Help us personalize your MUN experience
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Picture Display */}
            {user?.user_metadata?.avatar_url && (
              <div className="flex justify-center mb-6">
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Profile"
                  className="w-20 h-20 rounded-full border-4 border-primary-cta"
                />
              </div>
            )}

            {/* Email Display (Read-only) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-heading-text">
                Email
              </label>
              <Input
                value={user?.email || ''}
                disabled
                className="bg-muted text-muted-foreground"
              />
            </div>

            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-heading-text">Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone Number */}
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-heading-text">Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your phone number (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* College Affiliation */}
            <FormField
              control={form.control}
              name="college_affiliation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-heading-text">College/University Affiliation</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your college or university (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Year of Study */}
            <FormField
              control={form.control}
              name="year_of_study"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-heading-text">Year of Study</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 2nd Year, Graduate, etc. (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Interests */}
            <FormField
              control={form.control}
              name="interests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-heading-text">Interests *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter your interests (comma-separated), e.g., International Relations, Debate, Public Speaking, Politics, Diplomacy"
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-cta text-white hover:bg-primary-cta/90 py-6 text-lg font-semibold"
            >
              {isSubmitting ? "Completing Profile..." : "Complete Profile"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
} 