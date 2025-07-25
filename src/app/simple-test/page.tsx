"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'

export default function SimpleTestPage() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setResult('Testing...')
    
    try {
      // Test 1: Simple query
      const { error } = await supabase
        .from('events')
        .select('count')
        .limit(1)
      
      if (error) {
        setResult(`❌ Database Error: ${error.message}`)
      } else {
        setResult(`✅ Database Connected Successfully!`)
      }
    } catch (err) {
      setResult(`❌ Connection Failed: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  const testSimpleAuth = async () => {
    setLoading(true)
    setResult('Testing Auth...')
    
    try {
      // Test without triggers - anonymous signup
      const { data: authData, error } = await supabase.auth.signUp({
        email: `test_${Date.now()}@example.com`,
        password: 'testpass123',
      })
      
      if (error) {
        setResult(`❌ Auth Error: ${error.message}`)
      } else {
        setResult(`✅ Auth works! User ID: ${authData.user?.id}`)
      }
    } catch (err) {
      setResult(`❌ Auth Failed: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-heading-text">Simple Supabase Test</h1>
        
        <div className="space-y-4">
          <Button 
            onClick={testConnection}
            disabled={loading}
            className="w-full"
          >
            Test Database Connection
          </Button>
          
          <Button 
            onClick={testSimpleAuth}
            disabled={loading}
            variant="outline"
            className="w-full"
          >
            Test Simple Auth
          </Button>
        </div>
        
        {result && (
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <pre className="text-sm">{result}</pre>
          </div>
        )}
      </div>
    </div>
  )
} 