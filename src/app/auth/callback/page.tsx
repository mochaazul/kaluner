'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get('code')

  useEffect(() => {
    const handleCallback = async () => {
      if (code) {
        const supabase = createClientComponentClient()
        await supabase.auth.exchangeCodeForSession(code)
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    }

    handleCallback()
  }, [code, router])

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Autentikasi</h1>
        <p className="mb-4">Sedang memproses autentikasi...</p>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    </div>
  )
}
