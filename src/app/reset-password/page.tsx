'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

import { resetPassword } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const formSchema = z.object({
  password: z.string().min(6, 'Password minimal 6 karakter'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Password tidak cocok',
  path: ['confirmPassword'],
})

export default function ResetPasswordPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)
    
    try {
      const result = await resetPassword(data.password)
      
      if (!result.success) {
        setError(result.error || 'Terjadi kesalahan, silakan coba lagi')
      } else {
        setSuccess(true)
        // Redirect ke halaman login setelah 3 detik
        setTimeout(() => {
          router.push('/login')
        }, 3000)
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
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            Buat password baru untuk akun Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">
                Password berhasil diubah! Anda akan dialihkan ke halaman login dalam beberapa detik.
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
                <Label htmlFor="password">Password Baru</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••"
                    {...register('password')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={toggleShowPassword}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••"
                    {...register('confirmPassword')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={toggleShowPassword}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sedang memproses...
                  </>
                ) : (
                  'Reset Password'
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
