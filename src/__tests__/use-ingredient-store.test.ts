import { renderHook, act } from '@testing-library/react';
import { createClient } from '@/lib/supabase/client';
import { Ingredient, useIngredientStore } from '@/hooks/use-ingredient-store';

// Mock the Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(),
}));

describe('useIngredientStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the store state
    act(() => {
      useIngredientStore.setState({
        ingredients: [],
        selectedIngredientId: null,
        isLoading: false,
        error: null,
      });
    });
  });

  describe('fetchIngredients', () => {
    it('should fetch ingredients and update state', async () => {
      const mockIngredients: Ingredient[] = [
        { 
          id: '1', 
          name: 'Tepung Terigu', 
          cost_per_unit: 15000, 
          unit: 'kg', 
          stock_quantity: 10, 
          min_stock_level: 2,
          business_id: '1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { 
          id: '2', 
          name: 'Gula Pasir', 
          cost_per_unit: 12000, 
          unit: 'kg', 
          stock_quantity: 5, 
          min_stock_level: 1,
          business_id: '1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
      ];

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue({
          data: mockIngredients,
          error: null,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useIngredientStore());

      await act(async () => {
        await result.current.fetchIngredients();
      });

      expect(result.current.ingredients).toEqual(mockIngredients);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(mockSupabase.from).toHaveBeenCalledWith('ingredients');
      expect(mockSupabase.select).toHaveBeenCalledWith('*');
    });

    it('should handle errors when fetching ingredients', async () => {
      const mockError = new Error('Database error');

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useIngredientStore());

      await act(async () => {
        await result.current.fetchIngredients();
      });

      expect(result.current.ingredients).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError.message);
    });
  });

  describe('selectIngredient', () => {
    it('should update selectedIngredientId', () => {
      const { result } = renderHook(() => useIngredientStore());

      act(() => {
        result.current.selectIngredient('1');
      });

      expect(result.current.selectedIngredientId).toBe('1');
    });
  });

  describe('createIngredient', () => {
    it('should create an ingredient and update state', async () => {
      const newIngredient = {
        name: 'Coklat Bubuk',
        cost_per_unit: 25000,
        unit: 'kg',
        stock_quantity: 3,
        min_stock_level: 1,
        business_id: '1'
      };

      const createdIngredient: Ingredient = {
        id: '3',
        ...newIngredient,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: createdIngredient,
          error: null,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useIngredientStore());

      await act(async () => {
        await result.current.createIngredient(newIngredient as Omit<Ingredient, 'id' | 'created_at' | 'updated_at'>);
      });

      expect(result.current.ingredients).toEqual([createdIngredient]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(mockSupabase.from).toHaveBeenCalledWith('ingredients');
      expect(mockSupabase.insert).toHaveBeenCalledWith(newIngredient);
    });
  });

  describe('updateIngredient', () => {
    it('should update an ingredient and update state', async () => {
      const initialIngredients: Ingredient[] = [
        { 
          id: '1', 
          name: 'Tepung Terigu', 
          cost_per_unit: 15000, 
          unit: 'kg', 
          stock_quantity: 10, 
          min_stock_level: 2,
          business_id: '1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
      ];

      act(() => {
        useIngredientStore.setState({ ingredients: initialIngredients });
      });

      const updatedIngredient = {
        name: 'Tepung Terigu Premium',
        cost_per_unit: 18000,
      };

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          error: null,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useIngredientStore());

      await act(async () => {
        await result.current.updateIngredient('1', updatedIngredient);
      });

      expect(result.current.ingredients[0].name).toBe('Tepung Terigu Premium');
      expect(result.current.ingredients[0].cost_per_unit).toBe(18000);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(mockSupabase.from).toHaveBeenCalledWith('ingredients');
      expect(mockSupabase.update).toHaveBeenCalledWith(updatedIngredient);
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
    });
  });

  describe('deleteIngredient', () => {
    it('should delete an ingredient and update state', async () => {
      const initialIngredients: Ingredient[] = [
        { 
          id: '1', 
          name: 'Tepung Terigu', 
          cost_per_unit: 15000, 
          unit: 'kg', 
          stock_quantity: 10, 
          min_stock_level: 2,
          business_id: '1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { 
          id: '2', 
          name: 'Gula Pasir', 
          cost_per_unit: 12000, 
          unit: 'kg', 
          stock_quantity: 5, 
          min_stock_level: 1,
          business_id: '1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
      ];

      act(() => {
        useIngredientStore.setState({ 
          ingredients: initialIngredients,
          selectedIngredientId: '1'
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

      const { result } = renderHook(() => useIngredientStore());

      await act(async () => {
        await result.current.deleteIngredient('1');
      });

      expect(result.current.ingredients).toEqual([initialIngredients[1]]);
      expect(result.current.selectedIngredientId).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(mockSupabase.from).toHaveBeenCalledWith('ingredients');
      expect(mockSupabase.delete).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
    });
  });
});
