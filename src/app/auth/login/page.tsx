'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { login } from '@/app/auth/actions';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validateForm = () => {
    const errors: {
      email?: string;
      password?: string;
    } = {};
    
    if (!email) {
      errors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Format email tidak valid';
    }
    
    if (!password) {
      errors.password = 'Password wajib diisi';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    setError(null);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Masuk ke Kaluner</CardTitle>
          <CardDescription className="text-center">
            Masukkan email dan password Anda untuk masuk
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          
          {registered && (
            <div className="bg-green-50 text-green-600 p-3 rounded-md mb-4">
              Registrasi berhasil! Silakan login dengan akun Anda.
            </div>
          )}
          
          <form action={login} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nama@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
              {validationErrors.email && (
                <p className="text-sm text-red-600">{validationErrors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
              {validationErrors.password && (
                <p className="text-sm text-red-600">{validationErrors.password}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? 'Memproses...' : 'Masuk'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Belum punya akun?{' '}
            <Link href="/auth/register" className="text-blue-600 hover:underline">
              Daftar
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
