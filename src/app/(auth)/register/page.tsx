'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { AuthForm, AuthFormData } from '@/components/forms/auth-form'
import { registerUser } from '@/actions/auth'

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async (data: AuthFormData) => {
    setIsLoading(true)
    
    try {
      console.log("Registering user...")
      // Menggunakan Server Action untuk mendaftar
      const result = await registerUser({
        email: data.email,
        password: data.password,
        username: data.username,
        fullName: data.fullName,
      })
      
      console.log("Result:", result)
      return result
    } catch (error) {
      console.error('Registration error:', error)
      return {
        success: false,
        error: 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.'
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
      
      <AuthForm type="register" onSubmit={handleRegister} />
      
      <div className="mt-4 text-center text-sm">
        <p>Sudah punya akun? <Link href="/login" className="text-primary hover:underline">Masuk sekarang</Link></p>
        <p className="mt-2">Dengan mendaftar, Anda menyetujui <Link href="/terms" className="text-primary hover:underline">Syarat dan Ketentuan</Link> serta <Link href="/privacy" className="text-primary hover:underline">Kebijakan Privasi</Link> kami.</p>
      </div>
    </div>
  )
}
