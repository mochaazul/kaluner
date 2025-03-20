import { renderHook, act } from '@testing-library/react';
import { createClient } from '@/lib/supabase/client';
import { Promotion, usePromotionStore } from '@/hooks/use-promotion-store';
import { Json } from '@/lib/supabase/database.types';

// Mock the Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(),
}));

describe('usePromotionStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the store state
    act(() => {
      usePromotionStore.setState({
        promotions: [],
        selectedPromotionId: null,
        isLoading: false,
        error: null,
      });
    });
  });

  describe('fetchPromotions', () => {
    it('should fetch promotions and update state', async () => {
      const mockPromotions: Promotion[] = [
        { 
          id: '1', 
          business_id: '1',
          name: 'Diskon Akhir Pekan',
          description: 'Diskon 10% untuk semua menu di akhir pekan',
          start_date: '2025-03-01T00:00:00Z',
          end_date: '2025-03-31T23:59:59Z',
          discount_type: 'percentage',
          discount_value: 10,
          min_purchase: 50000,
          max_discount: 20000,
          applicable_items: ['all'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { 
          id: '2', 
          business_id: '1',
          name: 'Promo Beli 1 Gratis 1',
          description: 'Beli 1 minuman, gratis 1 minuman yang sama',
          start_date: '2025-03-15T00:00:00Z',
          end_date: '2025-04-15T23:59:59Z',
          discount_type: 'bogo',
          discount_value: 100,
          min_purchase: null,
          max_discount: null,
          applicable_items: ['category:minuman'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
      ];

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue({
          data: mockPromotions,
          error: null,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => usePromotionStore());

      await act(async () => {
        await result.current.fetchPromotions();
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('promotions');
      expect(mockSupabase.select).toHaveBeenCalled();
      expect(result.current.promotions).toEqual(mockPromotions);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle error when fetching promotions', async () => {
      const mockError = new Error('Failed to fetch promotions');
      
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => usePromotionStore());

      await act(async () => {
        await result.current.fetchPromotions();
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('promotions');
      expect(mockSupabase.select).toHaveBeenCalled();
      expect(result.current.promotions).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError.message);
    });
  });

  describe('selectPromotion', () => {
    it('should update selectedPromotionId', () => {
      const { result } = renderHook(() => usePromotionStore());

      act(() => {
        result.current.selectPromotion('1');
      });

      expect(result.current.selectedPromotionId).toBe('1');
    });
  });

  describe('createPromotion', () => {
    it('should create a promotion and update state', async () => {
      const newPromotion = {
        business_id: '1',
        name: 'Promo Baru',
        description: 'Deskripsi promo baru',
        start_date: '2025-04-01T00:00:00Z',
        end_date: '2025-04-30T23:59:59Z',
        discount_type: 'fixed_amount',
        discount_value: 15000,
        min_purchase: 100000,
        max_discount: null,
        applicable_items: ['category:makanan'],
      };

      const createdPromotion = {
        ...newPromotion,
        id: '3',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: createdPromotion,
          error: null,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => usePromotionStore());

      await act(async () => {
        await result.current.createPromotion(newPromotion);
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('promotions');
      expect(mockSupabase.insert).toHaveBeenCalledWith(newPromotion);
      expect(mockSupabase.select).toHaveBeenCalled();
      expect(result.current.promotions).toEqual([createdPromotion]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle error when creating a promotion', async () => {
      const newPromotion = {
        business_id: '1',
        name: 'Promo Error',
        description: 'Deskripsi promo error',
        start_date: '2025-04-01T00:00:00Z',
        end_date: '2025-04-30T23:59:59Z',
        discount_type: 'percentage',
        discount_value: 20,
        min_purchase: null,
        max_discount: null,
        applicable_items: null,
      };

      const mockError = new Error('Failed to create promotion');

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => usePromotionStore());

      await act(async () => {
        await result.current.createPromotion(newPromotion);
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('promotions');
      expect(mockSupabase.insert).toHaveBeenCalledWith(newPromotion);
      expect(result.current.promotions).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError.message);
    });
  });

  describe('updatePromotion', () => {
    it('should update a promotion and update state', async () => {
      const initialPromotions: Promotion[] = [
        { 
          id: '1', 
          business_id: '1',
          name: 'Diskon Akhir Pekan',
          description: 'Diskon 10% untuk semua menu di akhir pekan',
          start_date: '2025-03-01T00:00:00Z',
          end_date: '2025-03-31T23:59:59Z',
          discount_type: 'percentage',
          discount_value: 10,
          min_purchase: 50000,
          max_discount: 20000,
          applicable_items: ['all'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      act(() => {
        usePromotionStore.setState({ promotions: initialPromotions });
      });

      const updatedFields = {
        name: 'Diskon Akhir Pekan Updated',
        discount_value: 15,
        max_discount: 25000,
      };

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => usePromotionStore());

      await act(async () => {
        await result.current.updatePromotion('1', updatedFields);
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('promotions');
      expect(mockSupabase.update).toHaveBeenCalledWith(updatedFields);
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
      
      expect(result.current.promotions[0]).toEqual({
        ...initialPromotions[0],
        ...updatedFields,
      });
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle error when updating a promotion', async () => {
      const initialPromotions: Promotion[] = [
        { 
          id: '1', 
          business_id: '1',
          name: 'Diskon Akhir Pekan',
          description: 'Diskon 10% untuk semua menu di akhir pekan',
          start_date: '2025-03-01T00:00:00Z',
          end_date: '2025-03-31T23:59:59Z',
          discount_type: 'percentage',
          discount_value: 10,
          min_purchase: 50000,
          max_discount: 20000,
          applicable_items: ['all'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      act(() => {
        usePromotionStore.setState({ promotions: initialPromotions });
      });

      const updatedFields = {
        name: 'Diskon Akhir Pekan Error',
      };

      const mockError = new Error('Failed to update promotion');

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => usePromotionStore());

      await act(async () => {
        await result.current.updatePromotion('1', updatedFields);
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('promotions');
      expect(mockSupabase.update).toHaveBeenCalledWith(updatedFields);
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
      
      expect(result.current.promotions).toEqual(initialPromotions);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError.message);
    });
  });

  describe('deletePromotion', () => {
    it('should delete a promotion and update state', async () => {
      const initialPromotions: Promotion[] = [
        { 
          id: '1', 
          business_id: '1',
          name: 'Diskon Akhir Pekan',
          description: 'Diskon 10% untuk semua menu di akhir pekan',
          start_date: '2025-03-01T00:00:00Z',
          end_date: '2025-03-31T23:59:59Z',
          discount_type: 'percentage',
          discount_value: 10,
          min_purchase: 50000,
          max_discount: 20000,
          applicable_items: ['all'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { 
          id: '2', 
          business_id: '1',
          name: 'Promo Beli 1 Gratis 1',
          description: 'Beli 1 minuman, gratis 1 minuman yang sama',
          start_date: '2025-03-15T00:00:00Z',
          end_date: '2025-04-15T23:59:59Z',
          discount_type: 'bogo',
          discount_value: 100,
          min_purchase: null,
          max_discount: null,
          applicable_items: ['category:minuman'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      act(() => {
        usePromotionStore.setState({ 
          promotions: initialPromotions,
          selectedPromotionId: '1'
        });
      });

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => usePromotionStore());

      await act(async () => {
        await result.current.deletePromotion('1');
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('promotions');
      expect(mockSupabase.delete).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
      
      expect(result.current.promotions).toEqual([initialPromotions[1]]);
      expect(result.current.selectedPromotionId).toBe(null);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle error when deleting a promotion', async () => {
      const initialPromotions: Promotion[] = [
        { 
          id: '1', 
          business_id: '1',
          name: 'Diskon Akhir Pekan',
          description: 'Diskon 10% untuk semua menu di akhir pekan',
          start_date: '2025-03-01T00:00:00Z',
          end_date: '2025-03-31T23:59:59Z',
          discount_type: 'percentage',
          discount_value: 10,
          min_purchase: 50000,
          max_discount: 20000,
          applicable_items: ['all'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      act(() => {
        usePromotionStore.setState({ promotions: initialPromotions });
      });

      const mockError = new Error('Failed to delete promotion');

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => usePromotionStore());

      await act(async () => {
        await result.current.deletePromotion('1');
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('promotions');
      expect(mockSupabase.delete).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
      
      expect(result.current.promotions).toEqual(initialPromotions);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError.message);
    });
  });
});
