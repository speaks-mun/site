import { useState } from 'react'
import { toast } from 'sonner'

type ApiActionFunction<T = any, R = any> = (params: T) => Promise<R>

interface UseApiActionOptions {
  successMessage?: string
  errorMessage?: string
  onSuccess?: (result: any) => void
  onError?: (error: Error) => void
}

export function useApiAction<T = any, R = any>(
  apiFunction: ApiActionFunction<T, R>,
  options: UseApiActionOptions = {}
) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const execute = async (params: T): Promise<R | null> => {
    try {
      setIsLoading(true)
      setError(null)

      const result = await apiFunction(params)

      if (options.successMessage) {
        toast.success(options.successMessage)
      }

      options.onSuccess?.(result)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unexpected error occurred')
      setError(error)

      const errorMessage = options.errorMessage || error.message || 'Something went wrong'
      toast.error(errorMessage)

      options.onError?.(error)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    execute,
    isLoading,
    error,
  }
} 