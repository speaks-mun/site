"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'
import { useApiAction } from '@/hooks/use-api-action'

export default function InviteLinkPage() {
  const router = useRouter()
  const [inviteCode, setInviteCode] = useState('')

  const { execute: validateCode, isLoading } = useApiAction(
    async (code: string) => {
      if (!code.trim()) {
        throw new Error('Please enter an invite code')
      }

      // Check if invite code exists and is active
      const { data, error } = await supabase
        .from('invite_links')
        .select('id, is_active')
        .eq('code', code.trim())
        .eq('is_active', true)
        .single()

      if (error || !data) {
        throw new Error('Invalid or expired invite code')
      }

      return data
    },
    {
      successMessage: "Invite code validated! Redirecting to event creation...",
      onSuccess: () => {
        router.push('/create-event')
      },
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    validateCode(inviteCode)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-primary-cta rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-heading-text text-2xl font-bold">Speaks</span>
          </div>

          <CardTitle className="text-2xl font-bold text-heading-text">
            College/Organizer Access
          </CardTitle>
          <p className="text-body-text mt-2">
            Enter your invite code to create and manage MUN events
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="inviteCode" className="text-sm font-medium text-heading-text">
                Invite Code
              </label>
              <Input
                id="inviteCode"
                type="text"
                placeholder="Enter your invite code"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="text-center font-mono tracking-widest"
              />
              <p className="text-xs text-body-text">
                This code is provided by the Speaks team to verified colleges and organizers
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !inviteCode.trim()}
              className="w-full bg-primary-cta text-white hover:bg-primary-cta/90"
            >
              {isLoading ? "Validating..." : "Validate Code"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-body-text">
              Don&apos;t have an invite code?{" "}
              <a 
                href="mailto:admin@speaks.com?subject=Request for Event Creation Access"
                className="text-primary-cta hover:underline"
              >
                Request access
              </a>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              onClick={() => router.push('/')}
              className="text-body-text hover:text-heading-text"
            >
              ← Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 