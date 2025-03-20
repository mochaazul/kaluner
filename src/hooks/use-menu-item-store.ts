import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';

export type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  selling_price: number;
  cost_price: number | null;
  profit_margin: number | null;
  is_active: boolean;
  business_id: string;
  recipe_id: string | null;
  created_at: string;
  updated_at?: string;
};

type MenuItemState = {
  menuItems: MenuItem[];
  selectedMenuItemId: string | null;
  isLoading: boolean;
  error: string | null;
};

type MenuItemActions = {
  fetchMenuItems: () => Promise<void>;
  selectMenuItem: (id: string) => void;
  createMenuItem: (menuItem: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateMenuItem: (id: string, menuItem: Partial<MenuItem>) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
};


export const useMenuItemStore = create<MenuItemState & MenuItemActions>((set) => ({
  menuItems: [],
  selectedMenuItemId: null,
  isLoading: false,
  error: null,

  fetchMenuItems: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('menu_items')
        .select('*');
      
      if (error) throw error;
      
      set({ 
        menuItems: data as unknown as MenuItem[], 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat mengambil data menu', 
        isLoading: false 
      });
    }
  },
  
  selectMenuItem: (id: string) => {
    set({ selectedMenuItemId: id });
  },
  
  createMenuItem: async (menuItem) => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('menu_items')
        .insert(menuItem)
        .select()
        .single();
      
      if (error) throw error;
      
      set((state) => ({ 
        menuItems: [...state.menuItems, data as unknown as MenuItem], 
        isLoading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat membuat menu', 
        isLoading: false 
      });
    }
  },
  
  updateMenuItem: async (id, menuItem) => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('menu_items')
        .update(menuItem)
        .eq('id', id);
      
      if (error) throw error;
      
      set((state) => ({
        menuItems: state.menuItems.map((item) => 
          item.id === id ? { ...item, ...menuItem } : item
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat memperbarui menu', 
        isLoading: false 
      });
    }
  },
  
  deleteMenuItem: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set((state) => ({
        menuItems: state.menuItems.filter((menuItem) => menuItem.id !== id),
        selectedMenuItemId: state.selectedMenuItemId === id ? null : state.selectedMenuItemId,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat menghapus menu', 
        isLoading: false 
      });
    }
  },
}));

