import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import { Database, Json } from '@/lib/supabase/database.types';

export type Promotion = Database['public']['Tables']['promotions']['Row'];
export type NewPromotion = Database['public']['Tables']['promotions']['Insert'];
export type UpdatePromotion = Database['public']['Tables']['promotions']['Update'];

type PromotionState = {
  promotions: Promotion[];
  selectedPromotionId: string | null;
  isLoading: boolean;
  error: string | null;
};

type PromotionActions = {
  fetchPromotions: () => Promise<void>;
  selectPromotion: (id: string) => void;
  createPromotion: (promotion: NewPromotion) => Promise<void>;
  updatePromotion: (id: string, promotion: UpdatePromotion) => Promise<void>;
  deletePromotion: (id: string) => Promise<void>;
};

export const usePromotionStore = create<PromotionState & PromotionActions>((set) => ({
  promotions: [],
  selectedPromotionId: null,
  isLoading: false,
  error: null,

  fetchPromotions: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('promotions')
        .select('*');
      
      if (error) throw error;
      
      set({ 
        promotions: data as unknown as Promotion[], 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat mengambil data promosi', 
        isLoading: false 
      });
    }
  },
  
  selectPromotion: (id: string) => {
    set({ selectedPromotionId: id });
  },
  
  createPromotion: async (promotion: NewPromotion) => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('promotions')
        .insert(promotion)
        .select()
        .single();
      
      if (error) throw error;
      
      set((state) => ({ 
        promotions: [...state.promotions, data as unknown as Promotion], 
        isLoading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat membuat promosi baru', 
        isLoading: false 
      });
    }
  },
  
  updatePromotion: async (id: string, promotion: UpdatePromotion) => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('promotions')
        .update(promotion)
        .eq('id', id);
      
      if (error) throw error;
      
      set((state) => ({
        promotions: state.promotions.map((item) => 
          item.id === id ? { ...item, ...promotion } : item
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat memperbarui promosi', 
        isLoading: false 
      });
    }
  },
  
  deletePromotion: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set((state) => ({
        promotions: state.promotions.filter((promotion) => promotion.id !== id),
        selectedPromotionId: state.selectedPromotionId === id ? null : state.selectedPromotionId,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat menghapus promosi', 
        isLoading: false 
      });
    }
  },
}));
