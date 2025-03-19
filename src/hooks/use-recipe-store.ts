import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';

export type Recipe = {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  portion_size: number;
  portion_unit: string;
  business_id: string;
  created_at: string;
  updated_at?: string;
  cost?: number | null;
  image_url?: string | null;
};

type RecipeState = {
  recipes: Recipe[];
  selectedRecipeId: string | null;
  isLoading: boolean;
  error: string | null;
};

type RecipeActions = {
  fetchRecipes: () => Promise<void>;
  selectRecipe: (id: string) => void;
  createRecipe: (recipe: Omit<Recipe, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateRecipe: (id: string, recipe: Partial<Recipe>) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
};

export const useRecipeStore = create<RecipeState & RecipeActions>((set) => ({
  recipes: [],
  selectedRecipeId: null,
  isLoading: false,
  error: null,

  fetchRecipes: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('recipes')
        .select('*');
      
      if (error) throw error;
      
      set({ 
        recipes: data as unknown as Recipe[], 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat mengambil data resep', 
        isLoading: false 
      });
    }
  },
  
  selectRecipe: (id: string) => {
    set({ selectedRecipeId: id });
  },
  
  createRecipe: async (recipe) => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('recipes')
        .insert(recipe)
        .select()
        .single();
      
      if (error) throw error;
      
      set((state) => ({ 
        recipes: [...state.recipes, data as unknown as Recipe], 
        isLoading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat membuat resep', 
        isLoading: false 
      });
    }
  },
  
  updateRecipe: async (id, recipe) => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('recipes')
        .update(recipe)
        .eq('id', id);
      
      if (error) throw error;
      
      set((state) => ({
        recipes: state.recipes.map((item) => 
          item.id === id ? { ...item, ...recipe } : item
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat memperbarui resep', 
        isLoading: false 
      });
    }
  },
  
  deleteRecipe: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set((state) => ({
        recipes: state.recipes.filter((recipe) => recipe.id !== id),
        selectedRecipeId: state.selectedRecipeId === id ? null : state.selectedRecipeId,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat menghapus resep', 
        isLoading: false 
      });
    }
  },
}));
