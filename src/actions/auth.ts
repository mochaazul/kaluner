'use server'

import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'

export interface RegisterFormData {
  email: string
  password: string
  username?: string
  fullName?: string
}

export async function registerUser(formData: RegisterFormData) {
  try {
    const { email, password, username, fullName } = formData
    
    // Validasi input
    if (!email || !password) {
      return {
        success: false,
        error: 'Email dan password diperlukan'
      }
    }
    
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    // Buat pengguna baru
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })
    if (signUpError || !authData.user) {
      return {
        success: false,
        error: signUpError?.message || 'Gagal mendaftar'
      }
    }
    
    // Gunakan service role key untuk membuat profil (bypass RLS)
    const supabaseAdmin = createRouteHandlerClient(
      { cookies: () => cookieStore },
      { 
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      }
    )
    
    // Buat profil pengguna
    const { error: profileError } = await supabaseAdmin.from('profiles').insert({
      id: authData.user.id,
      username: username || email.split('@')[0],
      full_name: fullName || null,
      avatar_url: null,
      created_at: new Date().toISOString(),
    })
    
    if (profileError) {
      console.error('Error creating profile:', profileError)
      // Tetap lanjutkan meskipun ada error, karena pengguna sudah terdaftar
      return { 
        success: true,
        warning: 'Berhasil mendaftar tetapi gagal membuat profil. Silakan hubungi admin.',
        user: authData.user
      }
    }
    
    return { 
      success: true,
      message: 'Pendaftaran berhasil! Silakan periksa email Anda untuk verifikasi.',
      user: authData.user
    }
  } catch (error) {
    console.error('Registration error:', error)
    return {
      success: false,
      error: 'Terjadi kesalahan saat mendaftar'
    }
  }
}

export async function loginUser(email: string, password: string) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    return {
      success: false,
      error: error.message || 'Gagal masuk. Periksa email dan password Anda.'
    }
  }
  
  return { success: true }
}

export async function forgotPassword(email: string) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
  })
  
  if (error) {
    return {
      success: false,
      error: error.message || 'Terjadi kesalahan, silakan coba lagi'
    }
  }
  
  return { success: true }
}

export async function resetPassword(password: string) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  
  const { error } = await supabase.auth.updateUser({
    password,
  })
  
  if (error) {
    return {
      success: false,
      error: error.message || 'Terjadi kesalahan, silakan coba lagi'
    }
  }
  
  return { success: true }
}

export async function logoutUser() {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  
  await supabase.auth.signOut()
  redirect('/login')
}
