import { renderHook, act } from '@testing-library/react';
import { useRecipeStore, type Recipe } from '@/hooks/use-recipe-store';
import { createClient } from '@/lib/supabase/client';

// Mock the Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(),
}));

describe('useRecipeStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the store state
    act(() => {
      useRecipeStore.setState({
        recipes: [],
        selectedRecipeId: null,
        isLoading: false,
        error: null,
      });
    });
  });

  describe('fetchRecipes', () => {
    it('should fetch recipes and update state', async () => {
      const mockRecipes: Recipe[] = [
        { 
          id: '1', 
          name: 'Kue Coklat', 
          description: 'Kue coklat lembut', 
          category: 'dessert', 
          portion_size: 10, 
          portion_unit: 'potong',
          business_id: '1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { 
          id: '2', 
          name: 'Nasi Goreng', 
          description: 'Nasi goreng spesial', 
          category: 'main', 
          portion_size: 1, 
          portion_unit: 'porsi',
          business_id: '1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
      ];

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue({
          data: mockRecipes,
          error: null,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useRecipeStore());

      await act(async () => {
        await result.current.fetchRecipes();
      });

      expect(result.current.recipes).toEqual(mockRecipes);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(mockSupabase.from).toHaveBeenCalledWith('recipes');
      expect(mockSupabase.select).toHaveBeenCalledWith('*');
    });

    it('should handle errors when fetching recipes', async () => {
      const mockError = new Error('Database error');

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useRecipeStore());

      await act(async () => {
        await result.current.fetchRecipes();
      });

      expect(result.current.recipes).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError.message);
    });
  });

  describe('selectRecipe', () => {
    it('should update selectedRecipeId', () => {
      const { result } = renderHook(() => useRecipeStore());

      act(() => {
        result.current.selectRecipe('1');
      });

      expect(result.current.selectedRecipeId).toBe('1');
    });
  });

  describe('createRecipe', () => {
    it('should create a recipe and update state', async () => {
      const newRecipe = {
        name: 'Ayam Goreng',
        description: 'Ayam goreng renyah',
        category: 'main',
        portion_size: 1,
        portion_unit: 'porsi',
        business_id: '1'
      };

      const createdRecipe: Recipe = {
        id: '3',
        ...newRecipe,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: createdRecipe,
          error: null,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useRecipeStore());

      await act(async () => {
        await result.current.createRecipe(newRecipe as Omit<Recipe, 'id' | 'created_at' | 'updated_at'>);
      });

      expect(result.current.recipes).toEqual([createdRecipe]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(mockSupabase.from).toHaveBeenCalledWith('recipes');
      expect(mockSupabase.insert).toHaveBeenCalledWith(newRecipe);
    });
  });

  describe('updateRecipe', () => {
    it('should update a recipe and update state', async () => {
      const initialRecipes: Recipe[] = [
        { 
          id: '1', 
          name: 'Kue Coklat', 
          description: 'Kue coklat lembut', 
          category: 'dessert', 
          portion_size: 10, 
          portion_unit: 'potong',
          business_id: '1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
      ];

      act(() => {
        useRecipeStore.setState({ recipes: initialRecipes });
      });

      const updatedRecipe = {
        name: 'Kue Coklat Premium',
        description: 'Kue coklat lembut dengan taburan coklat premium',
      };

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          error: null,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useRecipeStore());

      await act(async () => {
        await result.current.updateRecipe('1', updatedRecipe);
      });

      expect(result.current.recipes[0].name).toBe('Kue Coklat Premium');
      expect(result.current.recipes[0].description).toBe('Kue coklat lembut dengan taburan coklat premium');
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(mockSupabase.from).toHaveBeenCalledWith('recipes');
      expect(mockSupabase.update).toHaveBeenCalledWith(updatedRecipe);
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
    });
  });

  describe('deleteRecipe', () => {
    it('should delete a recipe and update state', async () => {
      const initialRecipes: Recipe[] = [
        { 
          id: '1', 
          name: 'Kue Coklat', 
          description: 'Kue coklat lembut', 
          category: 'dessert', 
          portion_size: 10, 
          portion_unit: 'potong',
          business_id: '1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { 
          id: '2', 
          name: 'Nasi Goreng', 
          description: 'Nasi goreng spesial', 
          category: 'main', 
          portion_size: 1, 
          portion_unit: 'porsi',
          business_id: '1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
      ];

      act(() => {
        useRecipeStore.setState({ 
          recipes: initialRecipes,
          selectedRecipeId: '1'
        });
      });

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          error: null,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useRecipeStore());

      await act(async () => {
        await result.current.deleteRecipe('1');
      });

      expect(result.current.recipes).toEqual([initialRecipes[1]]);
      expect(result.current.selectedRecipeId).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(mockSupabase.from).toHaveBeenCalledWith('recipes');
      expect(mockSupabase.delete).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
    });
  });
});
