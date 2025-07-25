"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface TestResult {
  test: string
  status: 'pending' | 'success' | 'error'
  message: string
  data?: unknown
}

export default function DatabaseTestPage() {
  const [results, setResults] = useState<TestResult[]>([])
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()
  }, [])

  const updateResult = (test: string, status: 'success' | 'error', message: string, data?: unknown) => {
    setResults(prev => {
      const index = prev.findIndex(r => r.test === test)
      const newResult = { test, status, message, data }
      if (index >= 0) {
        return [...prev.slice(0, index), newResult, ...prev.slice(index + 1)]
      }
      return [...prev, newResult]
    })
  }

  const runDatabaseTests = async () => {
    setLoading(true)
    setResults([
      { test: 'Read Public Events', status: 'pending', message: 'Testing...' },
      { test: 'Read Users Table', status: 'pending', message: 'Testing...' },
      { test: 'Test Authentication', status: 'pending', message: 'Testing...' },
      { test: 'Create Test User', status: 'pending', message: 'Testing...' },
    ])

    try {
      // Test 1: Read public events (should work without auth)
      try {
        const { data: events, error } = await supabase
          .from('events')
          .select('*')
          .limit(5)

        if (error) {
          updateResult('Read Public Events', 'error', `Error: ${error.message}`)
        } else {
          updateResult('Read Public Events', 'success', `Found ${events?.length || 0} events`, events)
        }
      } catch (err) {
        updateResult('Read Public Events', 'error', `Exception: ${err}`)
      }

      // Test 2: Check current auth status
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) {
          updateResult('Test Authentication', 'error', `Auth Error: ${error.message}`)
        } else if (user) {
          updateResult('Test Authentication', 'success', `Logged in as: ${user.email}`, user)
        } else {
          updateResult('Test Authentication', 'error', 'No user logged in')
        }
      } catch (err) {
        updateResult('Test Authentication', 'error', `Auth Exception: ${err}`)
      }

      // Test 3: Try to read users table
      try {
        const { data: users, error } = await supabase
          .from('users')
          .select('id, email, name')
          .limit(5)

        if (error) {
          updateResult('Read Users Table', 'error', `Error: ${error.message}`)
        } else {
          updateResult('Read Users Table', 'success', `Found ${users?.length || 0} users`, users)
        }
      } catch (err) {
        updateResult('Read Users Table', 'error', `Exception: ${err}`)
      }

      // Test 4: Try to create a test user (if authenticated)
      if (user) {
        try {
          const testEmail = `test_${Date.now()}@example.com`
          const { data, error } = await supabase.auth.signUp({
            email: testEmail,
            password: 'testpassword123',
          })

          if (error) {
            updateResult('Create Test User', 'error', `Signup Error: ${error.message}`)
          } else {
            updateResult('Create Test User', 'success', `Test user created: ${testEmail}`, data)
          }
        } catch (err) {
          updateResult('Create Test User', 'error', `Signup Exception: ${err}`)
        }
      } else {
        updateResult('Create Test User', 'error', 'Must be logged in to test user creation')
      }

    } catch (err) {
      console.error('Test error:', err)
    } finally {
      setLoading(false)
    }
  }

  const testBasicConnection = async () => {
    setLoading(true)
    try {
      // Simple connection test
      const { error } = await supabase
        .from('events')
        .select('count')
        .limit(1)

      if (error) {
        updateResult('Basic Connection', 'error', `Connection failed: ${error.message}`)
      } else {
        updateResult('Basic Connection', 'success', 'Database connection successful!')
      }
    } catch (err) {
      updateResult('Basic Connection', 'error', `Connection exception: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-heading-text">Database Connectivity Tests</CardTitle>
            <p className="text-body-text">
              Test Supabase connection, RLS policies, and authentication
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button 
                onClick={testBasicConnection} 
                disabled={loading}
                variant="outline"
              >
                {loading ? 'Testing...' : 'Test Basic Connection'}
              </Button>
              <Button 
                onClick={runDatabaseTests} 
                disabled={loading}
                className="bg-primary-cta text-white hover:bg-primary-cta/90"
              >
                {loading ? 'Running Tests...' : 'Run All Tests'}
              </Button>
            </div>

            {user ? (
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-200">
                  ✅ Authenticated as: {user.email}
                </p>
              </div>
            ) : (
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ⚠️ Not authenticated - some tests will fail
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test Results */}
        <div className="space-y-4">
          {results.map((result, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-heading-text">{result.test}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    result.status === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    result.status === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {result.status}
                  </span>
                </div>
                <p className="text-body-text text-sm mb-2">{result.message}</p>
                {result.data !== undefined && result.data !== null && (
                  <details className="text-xs">
                    <summary className="cursor-pointer text-primary-cta">Show Data</summary>
                    <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-auto">
                      {typeof result.data === 'object' ? JSON.stringify(result.data, null, 2) : String(result.data)}
                    </pre>
                  </details>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 