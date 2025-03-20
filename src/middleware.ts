import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Pertama, update session untuk refresh token
  const response = await updateSession(request)

  // Logika redirect untuk autentikasi
  const url = new URL(request.url)
  
  // Cek apakah user sudah login dengan menggunakan cookies
  const hasSessionCookie = request.cookies.has('sb-access-token') || 
                          request.cookies.has('sb-refresh-token')

  // Jika mengakses halaman utama dan belum login, redirect ke login
  if (url.pathname === '/' && !hasSessionCookie) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Jika mengakses halaman auth tapi sudah login, redirect ke dashboard
  if (
    (url.pathname === '/auth/login' || 
     url.pathname === '/auth/register') && 
    hasSessionCookie
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

// Konfigurasi path mana saja yang akan diproses oleh middleware
export const config = {
  matcher: [
    '/',
    '/auth/login',
    '/auth/register',
    '/dashboard',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
