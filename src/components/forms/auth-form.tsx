'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

// Definisi schema yang dapat digunakan kembali
export const authFormSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  confirmPassword: z.string().optional(),
  fullName: z.string().optional(),
  username: z.string().optional(),
}).refine(data => {
  if (data.confirmPassword !== undefined) {
    return data.password === data.confirmPassword
  }
  return true
}, {
  message: 'Password tidak cocok',
  path: ['confirmPassword'],
})

export type AuthFormData = z.infer<typeof authFormSchema>

interface AuthFormProps {
  type: 'login' | 'register'
  onSubmit: (data: AuthFormData) => Promise<{ success: boolean; error?: string; message?: string }>
}

export function AuthForm({ type, onSubmit }: AuthFormProps) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: type === 'register' ? '' : undefined,
      fullName: type === 'register' ? '' : undefined,
      username: type === 'register' ? '' : undefined,
    },
  })

  const onFormSubmit = async (data: AuthFormData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await onSubmit(data)
      
      if (!result.success) {
        setError(result.error || 'Terjadi kesalahan, silakan coba lagi')
      } else {
        router.refresh()
        router.push('/')
      }
    } catch (err) {
      setError('Terjadi kesalahan, silakan coba lagi')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleShowPassword = () => setShowPassword(!showPassword)

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{type === 'login' ? 'Masuk' : 'Daftar'}</CardTitle>
        <CardDescription>
          {type === 'login' 
            ? 'Masuk ke akun Kaluner Anda' 
            : 'Buat akun baru untuk menggunakan Kaluner'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {type === 'register' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="fullName">Nama Lengkap</Label>
                <Input
                  id="fullName"
                  placeholder="Masukkan nama lengkap Anda"
                  {...register('fullName')}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500">{errors.fullName.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Masukkan username Anda"
                  {...register('username')}
                />
                {errors.username && (
                  <p className="text-sm text-red-500">{errors.username.message}</p>
                )}
              </div>
            </>
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
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password Anda"
                {...register('password')}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={toggleShowPassword}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          
          {type === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Konfirmasi password Anda"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={toggleShowPassword}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>
          )}
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {type === 'login' ? 'Sedang masuk...' : 'Sedang mendaftar...'}
              </>
            ) : (
              type === 'login' ? 'Masuk' : 'Daftar'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        {type === 'login' ? (
          <p className="text-sm text-center">
            Belum punya akun?{' '}
            <a href="/register" className="text-primary hover:underline">
              Daftar sekarang
            </a>
          </p>
        ) : (
          <p className="text-sm text-center">
            Sudah punya akun?{' '}
            <a href="/login" className="text-primary hover:underline">
              Masuk
            </a>
          </p>
        )}
      </CardFooter>
    </Card>
  )
}
