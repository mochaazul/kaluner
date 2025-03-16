'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { AuthForm, AuthFormData } from '@/components/forms/auth-form'
import { loginUser } from '@/actions/auth'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (data: AuthFormData) => {
    setIsLoading(true)
    
    try {
      const result = await loginUser(data.email, data.password)
      return result
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        error: 'Terjadi kesalahan saat masuk. Silakan coba lagi.'
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="mb-8 flex flex-col items-center">
        <Link href="/">
          <div className="mb-4 w-[150px] h-[150px]">
            <Image
              src="/kaluner-logo.svg"
              alt="Kaluner Logo"
              width={150}
              height={150}
              priority
            />
          </div>
        </Link>
        <h1 className="text-2xl font-bold">Kaluner</h1>
        <p className="text-gray-600">Manajemen Bisnis Kuliner</p>
      </div>
      
      <AuthForm type="login" onSubmit={handleLogin} />
      
      <div className="mt-4 text-center text-sm">
        <p>Belum punya akun? <Link href="/register" className="text-primary hover:underline">Daftar sekarang</Link></p>
        <p className="mt-2"><Link href="/forgot-password" className="text-gray-600 hover:underline">Lupa password?</Link></p>
      </div>
    </div>
  )
}
