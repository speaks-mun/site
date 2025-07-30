import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Use fallback values during build to prevent build errors
  const url = supabaseUrl || 'https://placeholder.supabase.co'
  const key = supabaseAnonKey || 'placeholder-key'

  const supabase = createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Only check auth in production/runtime
  let user = null
  if (supabaseUrl && supabaseAnonKey) {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      user = authUser
    } catch (error) {
      console.error('Middleware auth check error:', error)
    }
  }

  // Define protected routes that require authentication
  const protectedRoutes = [
    '/discover',
    '/create-event',
    '/profile',
    '/my-events',
    '/settings',
    '/support',
    '/bookmarks'
  ]

  // Define public auth routes that should redirect if authenticated
  const publicAuthRoutes = [
    '/auth/login',
    '/auth/signup'
  ]

  const { pathname } = request.nextUrl

  // Allow auth callback to pass through
  if (pathname === '/auth/callback') {
    return response
  }

  // Redirect authenticated users away from public auth pages
  if (user && (publicAuthRoutes.includes(pathname) || pathname === '/')) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/discover'
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect unauthenticated users from protected routes
  if (!user && protectedRoutes.some(route => pathname.startsWith(route))) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/auth/login'
    return NextResponse.redirect(redirectUrl)
  }

  // Check organizer access for event creation routes
  if (user && pathname.startsWith('/create-event') && pathname !== '/create-event/invite') {
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('is_organizer')
        .eq('id', user.id)
        .single()

      if (!userData?.is_organizer) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/discover'
        return NextResponse.redirect(redirectUrl)
      }
    } catch (error) {
      // If there's an error checking organizer status, redirect to discover
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/discover'
      return NextResponse.redirect(redirectUrl)
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 