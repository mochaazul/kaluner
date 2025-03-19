import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';

export type Ingredient = {
  id: string;
  name: string;
  cost_per_unit: number;
  unit: string;
  stock_quantity: number | null;
  min_stock_level: number | null;
  business_id: string;
  created_at: string;
  updated_at?: string;
  supplier_id?: string | null;
};

type IngredientState = {
  ingredients: Ingredient[];
  selectedIngredientId: string | null;
  isLoading: boolean;
  error: string | null;
};

type IngredientActions = {
  fetchIngredients: () => Promise<void>;
  selectIngredient: (id: string) => void;
  createIngredient: (ingredient: Omit<Ingredient, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateIngredient: (id: string, ingredient: Partial<Ingredient>) => Promise<void>;
  deleteIngredient: (id: string) => Promise<void>;
};

export const useIngredientStore = create<IngredientState & IngredientActions>((set) => ({
  ingredients: [],
  selectedIngredientId: null,
  isLoading: false,
  error: null,

  fetchIngredients: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('ingredients')
        .select('*');
      
      if (error) throw error;
      
      set({ 
        ingredients: data as unknown as Ingredient[], 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat mengambil data bahan', 
        isLoading: false 
      });
    }
  },
  
  selectIngredient: (id: string) => {
    set({ selectedIngredientId: id });
  },
  
  createIngredient: async (ingredient) => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('ingredients')
        .insert(ingredient)
        .select()
        .single();
      
      if (error) throw error;
      
      set((state) => ({ 
        ingredients: [...state.ingredients, data as unknown as Ingredient], 
        isLoading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat membuat bahan', 
        isLoading: false 
      });
    }
  },
  
  updateIngredient: async (id, ingredient) => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('ingredients')
        .update(ingredient)
        .eq('id', id);
      
      if (error) throw error;
      
      set((state) => ({
        ingredients: state.ingredients.map((item) => 
          item.id === id ? { ...item, ...ingredient } : item
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat memperbarui bahan', 
        isLoading: false 
      });
    }
  },
  
  deleteIngredient: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('ingredients')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set((state) => ({
        ingredients: state.ingredients.filter((ingredient) => ingredient.id !== id),
        selectedIngredientId: state.selectedIngredientId === id ? null : state.selectedIngredientId,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat menghapus bahan', 
        isLoading: false 
      });
    }
  },
}));
