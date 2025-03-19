import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';

export type Business = {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  address: string | null;
  phone: string | null;
  created_at?: string;
  updated_at?: string;
  owner_id?: string;
};

type BusinessStore = {
  businesses: Business[];
  selectedBusinessId: string | null;
  isLoading: boolean;
  error: string | null;
  fetchBusinesses: () => Promise<void>;
  selectBusiness: (id: string) => void;
  createBusiness: (business: Omit<Business, 'id'> & { owner_id: string }) => Promise<void>;
  updateBusiness: (id: string, business: Partial<Business>) => Promise<void>;
  deleteBusiness: (id: string) => Promise<void>;
};

export const useBusinessStore = create<BusinessStore>((set) => ({
  businesses: [],
  selectedBusinessId: null,
  isLoading: false,
  error: null,
  
  fetchBusinesses: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('businesses')
        .select('*');
      
      if (error) throw error;
      
      set({ businesses: data || [], isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat mengambil data bisnis', 
        isLoading: false 
      });
    }
  },
  
  selectBusiness: (id: string) => {
    set({ selectedBusinessId: id });
  },
  
  createBusiness: async (business) => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('businesses')
        .insert(business)
        .select()
        .single();
      
      if (error) throw error;
      
      set((state) => ({ 
        businesses: [...state.businesses, data as unknown as Business], 
        isLoading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat membuat bisnis', 
        isLoading: false 
      });
    }
  },
  
  updateBusiness: async (id, business) => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('businesses')
        .update(business)
        .eq('id', id);
      
      if (error) throw error;
      
      set((state) => ({ 
        businesses: state.businesses.map((b) => 
          b.id === id ? { ...b, ...business } : b
        ), 
        isLoading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat memperbarui bisnis', 
        isLoading: false 
      });
    }
  },
  
  deleteBusiness: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('businesses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set((state) => ({ 
        businesses: state.businesses.filter((b) => b.id !== id),
        selectedBusinessId: state.selectedBusinessId === id ? null : state.selectedBusinessId,
        isLoading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat menghapus bisnis', 
        isLoading: false 
      });
    }
  },
}));
