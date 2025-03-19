import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from './database.types';

// Client Component Supabase Client
export const createClient = () => {
  return createClientComponentClient<Database>();
};

// Server Component Supabase Client
export const createServerClient = () => {
  const cookieStore = cookies();
  return createServerComponentClient<Database>({ cookies: () => cookieStore });
};
