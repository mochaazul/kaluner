import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import { User, Session, Provider } from '@supabase/supabase-js';

type AuthState = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
};

type AuthActions = {
  register: (email: string, password: string, metadata?: Record<string, any>) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithProvider: (provider: Provider) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUser: (userData: Record<string, any>) => Promise<void>;
  getCurrentUser: () => Promise<void>;
  getSession: () => Promise<void>;
  refreshSession: () => Promise<void>;
  isAuthenticated: () => boolean;
};

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  user: null,
  session: null,
  isLoading: false,
  error: null,
  
  register: async (email: string, password: string, metadata?: Record<string, any>) => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata },
      });
      
      if (error) throw error;
      
      set({ 
        user: data.user, 
        session: data.session,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Terjadi kesalahan saat mendaftar', 
        isLoading: false 
      });
    }
  },
  
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      set({ 
        user: data.user, 
        session: data.session,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Terjadi kesalahan saat login', 
        isLoading: false 
      });
    }
  },
  
  loginWithProvider: async (provider: Provider) => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) throw error;
      
      // Tidak perlu set user/session di sini karena akan redirect ke provider
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || `Terjadi kesalahan saat login dengan ${provider}`, 
        isLoading: false 
      });
    }
  },
  
  logout: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      set({ 
        user: null, 
        session: null,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        user: null, // Tetap logout meskipun ada error
        session: null,
        error: error.message || 'Terjadi kesalahan saat logout', 
        isLoading: false 
      });
    }
  },
  
  resetPassword: async (email: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Terjadi kesalahan saat reset password', 
        isLoading: false 
      });
    }
  },
  
  updateUser: async (userData: Record<string, any>) => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.updateUser({
        data: userData,
      });
      
      if (error) throw error;
      
      set({ 
        user: data.user, 
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Terjadi kesalahan saat memperbarui profil', 
        isLoading: false 
      });
    }
  },
  
  getCurrentUser: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      
      set({ 
        user: data.user, 
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        user: null,
        error: error.message || 'Terjadi kesalahan saat mengambil data pengguna', 
        isLoading: false 
      });
    }
  },
  
  getSession: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      set({ 
        session: data.session,
        user: data.session?.user || null,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Terjadi kesalahan saat mengambil session', 
        isLoading: false 
      });
    }
  },
  
  refreshSession: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) throw error;
      
      set({ 
        session: data.session,
        user: data.user,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Terjadi kesalahan saat refresh session', 
        isLoading: false 
      });
    }
  },
  
  isAuthenticated: () => {
    return !!get().user;
  },
}));
