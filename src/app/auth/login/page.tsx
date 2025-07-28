"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase/client"
import { useApiAction } from "@/hooks/use-api-action"
import Link from "next/link"
import { FaGoogle } from "react-icons/fa"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)

  const { execute: handleGoogleLogin, isLoading } = useApiAction(
    async () => {
      // Get the current origin to ensure correct redirect URL
      const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
      
      console.log('Initiating Google OAuth with redirect to:', `${origin}/auth/callback`)
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })
      
      if (error) {
        console.error('OAuth initiation error:', error)
        throw error
      }
      
      return true
    },
    {
      errorMessage: "Failed to sign in with Google. Please try again.",
    }
  )

  const { execute: handleEmailAuth, isLoading: isEmailLoading } = useApiAction(
    async () => {
      if (!email || !password) throw new Error("Please enter email and password")
      
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/callback`
          }
        })
        if (error) throw error
        return "signup"
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        return "signin"
      }
    },
    {
      successMessage: isSignUp ? "Check your email for verification link!" : "Sign in successful!",
      onSuccess: (result) => {
        if (result === "signin") {
          router.push('/auth/onboarding')
        }
      },
      errorMessage: isSignUp ? "Failed to sign up" : "Failed to sign in",
    }
  )

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-primary-cta rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-heading-text text-2xl font-bold">Speaks</span>
          </div>

          {/* Welcome text */}
          <h2 className="text-3xl font-bold text-heading-text mb-4">
            Welcome to Speaks
          </h2>
          <p className="text-body-text text-lg mb-8">
            Sign in to discover and create MUN events
          </p>
        </div>

        <div className="space-y-4">
          {/* Google OAuth Button */}
          <Button
            onClick={() => {
              console.log('Google login clicked');
              handleGoogleLogin({});
            }}
            disabled={isLoading}
            className="w-full bg-[#22D3EE] text-white hover:bg-[#22D3EE]/90 py-6 text-lg font-semibold flex items-center justify-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <FaGoogle className="w-5 h-5 flex-shrink-0" />
            <span>{isLoading ? "Connecting to Google..." : "Sign in with Google"}</span>
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border-divider" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-body-text">Or continue with email</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <div className="space-y-3">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
            <Button
              onClick={() => handleEmailAuth({})}
              disabled={isEmailLoading || !email || !password}
              variant="outline"
              className="w-full py-3 text-md font-semibold"
            >
              {isEmailLoading ? "Processing..." : (isSignUp ? "Sign Up" : "Sign In")}
            </Button>
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-primary-cta hover:underline"
              >
                {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border-divider" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-body-text">Organizers</span>
            </div>
          </div>

          {/* College/Organizer Button */}
          <Link href="/create-event/invite">
            <Button
              variant="outline"
              className="w-full border-2 border-border-divider text-heading-text hover:bg-card-background py-6 text-lg font-semibold"
            >
              Are you a College/Organizer? Event Creation
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-body-text">
          <p>
            By signing in, you agree to our{" "}
            <Link href="/terms" className="text-primary-cta hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary-cta hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 