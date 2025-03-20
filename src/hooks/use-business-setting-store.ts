import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import { Database, Json } from '@/lib/supabase/database.types';

export type BusinessSetting = Database['public']['Tables']['business_settings']['Row'];
export type NewBusinessSetting = Database['public']['Tables']['business_settings']['Insert'];
export type UpdateBusinessSetting = Database['public']['Tables']['business_settings']['Update'];

type BusinessSettingState = {
  businessSettings: BusinessSetting[];
  isLoading: boolean;
  error: string | null;
};

type BusinessSettingActions = {
  fetchBusinessSettings: (businessId: string) => Promise<void>;
  getSetting: (key: string) => Json | null;
  updateSetting: (id: string, key: string, value: Json) => Promise<void>;
  createSetting: (setting: NewBusinessSetting) => Promise<void>;
  deleteSetting: (id: string) => Promise<void>;
};

export const useBusinessSettingStore = create<BusinessSettingState & BusinessSettingActions>((set, get) => ({
  businessSettings: [],
  isLoading: false,
  error: null,

  fetchBusinessSettings: async (businessId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('business_settings')
        .select('*')
        .eq('business_id', businessId);
      
      if (error) throw error;
      
      set({ 
        businessSettings: data as unknown as BusinessSetting[], 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat mengambil data pengaturan bisnis', 
        isLoading: false 
      });
    }
  },

  getSetting: (key: string) => {
    const { businessSettings } = get();
    const setting = businessSettings.find(setting => setting.setting_key === key);
    return setting ? setting.setting_value : null;
  },
  
  updateSetting: async (id: string, key: string, value: Json) => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('business_settings')
        .update({ setting_value: value })
        .eq('id', id);
      
      if (error) throw error;
      
      set((state) => ({
        businessSettings: state.businessSettings.map((setting) => 
          setting.id === id ? { ...setting, setting_key: key, setting_value: value } : setting
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat memperbarui pengaturan', 
        isLoading: false 
      });
    }
  },
  
  createSetting: async (setting: NewBusinessSetting) => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('business_settings')
        .insert(setting)
        .select()
        .single();
      
      if (error) throw error;
      
      set((state) => ({ 
        businessSettings: [...state.businessSettings, data as unknown as BusinessSetting], 
        isLoading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat membuat pengaturan baru', 
        isLoading: false 
      });
    }
  },
  
  deleteSetting: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('business_settings')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set((state) => ({
        businessSettings: state.businessSettings.filter((setting) => setting.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat menghapus pengaturan', 
        isLoading: false 
      });
    }
  },
}));
