'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'

import { forgotPassword } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const formSchema = z.object({
  email: z.string().email('Email tidak valid'),
})

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)
    
    try {
      const result = await forgotPassword(data.email)
      
      if (!result.success) {
        setError(result.error || 'Terjadi kesalahan, silakan coba lagi')
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError('Terjadi kesalahan, silakan coba lagi')
      console.error(err)
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
      
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Lupa Password</CardTitle>
          <CardDescription>
            Masukkan email Anda untuk menerima link reset password
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">
                Link reset password telah dikirim ke email Anda. Silakan periksa kotak masuk atau folder spam Anda.
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@contoh.com"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sedang mengirim...
                  </>
                ) : (
                  'Kirim Link Reset Password'
                )}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-center">
            <Link href="/login" className="text-primary hover:underline">
              Kembali ke halaman login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
