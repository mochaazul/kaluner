'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return {
      error: 'Email dan password wajib diisi',
    };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        error: error.message,
      };
    }

    // Redirect ke dashboard jika berhasil login
    redirect('/dashboard');
  } catch (error) {
    return {
      error: 'Terjadi kesalahan saat login',
    };
  }
}

export async function register(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const name = formData.get('name') as string;

  if (!email || !password || !confirmPassword) {
    return {
      error: 'Semua field wajib diisi',
    };
  }

  if (password !== confirmPassword) {
    return {
      error: 'Password dan konfirmasi password tidak sama',
    };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      return {
        error: error.message,
      };
    }

    // Redirect ke halaman sukses atau login
    redirect('/auth/login?registered=true');
  } catch (error) {
    return {
      error: 'Terjadi kesalahan saat registrasi',
    };
  }
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/auth/login');
}

export async function resetPassword(formData: FormData) {
  const email = formData.get('email') as string;

  if (!email) {
    return {
      error: 'Email wajib diisi',
    };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password/confirm`,
    });

    if (error) {
      return {
        error: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      error: 'Terjadi kesalahan saat mengirim reset password',
    };
  }
}
