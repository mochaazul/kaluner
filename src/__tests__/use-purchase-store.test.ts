import { renderHook, act } from '@testing-library/react';
import { createClient } from '@/lib/supabase/client';
import { Purchase, PurchaseItem, NewPurchase, NewPurchaseItem, usePurchaseStore } from '@/hooks/use-purchase-store';

// Mock the Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(),
}));

describe('usePurchaseStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the store state
    act(() => {
      usePurchaseStore.setState({
        purchases: [],
        purchaseItems: [],
        selectedPurchaseId: null,
        isLoading: false,
        error: null,
      });
    });
  });

  describe('fetchPurchases', () => {
    it('should fetch purchases and update state', async () => {
      const mockPurchases: Purchase[] = [
        { 
          id: '1', 
          business_id: '1',
          supplier_id: '1',
          date: new Date().toISOString(),
          total_amount: 500000,
          payment_status: 'paid',
          payment_due: null,
          notes: 'Pembelian bahan baku bulan Maret',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { 
          id: '2', 
          business_id: '1',
          supplier_id: '2',
          date: new Date().toISOString(),
          total_amount: 750000,
          payment_status: 'unpaid',
          payment_due: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
          notes: 'Pembelian bahan baku bulan April',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
      ];

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue({
          data: mockPurchases,
          error: null,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => usePurchaseStore());

      await act(async () => {
        await result.current.fetchPurchases();
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('purchases');
      expect(mockSupabase.select).toHaveBeenCalled();
      expect(result.current.purchases).toEqual(mockPurchases);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle error when fetching purchases', async () => {
      const mockError = new Error('Failed to fetch purchases');
      
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => usePurchaseStore());

      await act(async () => {
        await result.current.fetchPurchases();
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('purchases');
      expect(mockSupabase.select).toHaveBeenCalled();
      expect(result.current.purchases).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError.message);
    });
  });

  describe('fetchPurchaseItems', () => {
    it('should fetch purchase items for a specific purchase and update state', async () => {
      const purchaseId = '1';
      const mockPurchaseItems: PurchaseItem[] = [
        { 
          id: '1', 
          purchase_id: purchaseId,
          ingredient_id: '1',
          quantity: 10,
          unit_price: 25000,
          subtotal: 250000,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { 
          id: '2', 
          purchase_id: purchaseId,
          ingredient_id: '2',
          quantity: 5,
          unit_price: 50000,
          subtotal: 250000,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
      ];

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: mockPurchaseItems,
          error: null,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => usePurchaseStore());

      await act(async () => {
        await result.current.fetchPurchaseItems(purchaseId);
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('purchase_items');
      expect(mockSupabase.select).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('purchase_id', purchaseId);
      expect(result.current.purchaseItems).toEqual(mockPurchaseItems);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle error when fetching purchase items', async () => {
      const purchaseId = '1';
      const mockError = new Error('Failed to fetch purchase items');
      
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => usePurchaseStore());

      await act(async () => {
        await result.current.fetchPurchaseItems(purchaseId);
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('purchase_items');
      expect(mockSupabase.select).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('purchase_id', purchaseId);
      expect(result.current.purchaseItems).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError.message);
    });
  });

  describe('selectPurchase', () => {
    it('should update selectedPurchaseId', () => {
      const { result } = renderHook(() => usePurchaseStore());

      act(() => {
        result.current.selectPurchase('1');
      });

      expect(result.current.selectedPurchaseId).toBe('1');
    });
  });

  describe('createPurchase', () => {
    it('should create a purchase with items and update state', async () => {
      const newPurchase: NewPurchase = {
        business_id: '1',
        supplier_id: '1',
        date: new Date().toISOString(),
        total_amount: 300000,
        payment_status: 'unpaid',
        payment_due: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(),
        notes: 'Pembelian bahan baku baru',
      };

      const newPurchaseItems: NewPurchaseItem[] = [
        {
          purchase_id: '', // Will be filled with the created purchase id
          ingredient_id: '3',
          quantity: 20,
          unit_price: 10000,
          subtotal: 200000,
        },
        {
          purchase_id: '', // Will be filled with the created purchase id
          ingredient_id: '4',
          quantity: 10,
          unit_price: 10000,
          subtotal: 100000,
        }
      ];

      const createdPurchase = {
        ...newPurchase,
        id: '3',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const createdPurchaseItems = newPurchaseItems.map((item, index) => ({
        ...item,
        purchase_id: '3',
        id: `${index + 3}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

      const mockSupabaseForPurchase = {
        from: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: createdPurchase,
          error: null,
        }),
      };

      const mockSupabaseForItems = {
        from: jest.fn().mockReturnThis(),
        insert: jest.fn().mockResolvedValue({
          data: createdPurchaseItems,
          error: null,
        }),
      };

      (createClient as jest.Mock)
        .mockReturnValueOnce(mockSupabaseForPurchase)
        .mockReturnValueOnce(mockSupabaseForItems);

      const { result } = renderHook(() => usePurchaseStore());

      await act(async () => {
        await result.current.createPurchase(newPurchase, newPurchaseItems);
      });

      expect(createClient).toHaveBeenCalledTimes(2);
      expect(mockSupabaseForPurchase.from).toHaveBeenCalledWith('purchases');
      expect(mockSupabaseForPurchase.insert).toHaveBeenCalledWith(newPurchase);
      expect(mockSupabaseForItems.from).toHaveBeenCalledWith('purchase_items');
      expect(mockSupabaseForItems.insert).toHaveBeenCalledWith(
        newPurchaseItems.map(item => ({
          ...item,
          purchase_id: createdPurchase.id,
        }))
      );
      
      expect(result.current.purchases).toEqual([createdPurchase]);
      expect(result.current.purchaseItems).toEqual(createdPurchaseItems);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle error when creating a purchase', async () => {
      const newPurchase: NewPurchase = {
        business_id: '1',
        supplier_id: '1',
        date: new Date().toISOString(),
        total_amount: 300000,
        payment_status: 'unpaid',
        payment_due: null,
        notes: 'Pembelian dengan error',
      };

      const newPurchaseItems: NewPurchaseItem[] = [
        {
          purchase_id: '', // Will be filled with the created purchase id
          ingredient_id: '3',
          quantity: 20,
          unit_price: 10000,
          subtotal: 200000,
        }
      ];

      const mockError = new Error('Failed to create purchase');

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

      const { result } = renderHook(() => usePurchaseStore());

      await act(async () => {
        await result.current.createPurchase(newPurchase, newPurchaseItems);
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('purchases');
      expect(mockSupabase.insert).toHaveBeenCalledWith(newPurchase);
      expect(result.current.purchases).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError.message);
    });
  });

  describe('updatePurchase', () => {
    it('should update a purchase and update state', async () => {
      const initialPurchases: Purchase[] = [
        { 
          id: '1', 
          business_id: '1',
          supplier_id: '1',
          date: new Date().toISOString(),
          total_amount: 500000,
          payment_status: 'unpaid',
          payment_due: null,
          notes: 'Pembelian bahan baku bulan Maret',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      act(() => {
        usePurchaseStore.setState({ purchases: initialPurchases });
      });

      const updatedFields = {
        payment_status: 'paid',
        notes: 'Pembelian bahan baku bulan Maret - Sudah dibayar',
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

      const { result } = renderHook(() => usePurchaseStore());

      await act(async () => {
        await result.current.updatePurchase('1', updatedFields);
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('purchases');
      expect(mockSupabase.update).toHaveBeenCalledWith(updatedFields);
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
      
      expect(result.current.purchases[0]).toEqual({
        ...initialPurchases[0],
        ...updatedFields,
      });
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle error when updating a purchase', async () => {
      const initialPurchases: Purchase[] = [
        { 
          id: '1', 
          business_id: '1',
          supplier_id: '1',
          date: new Date().toISOString(),
          total_amount: 500000,
          payment_status: 'unpaid',
          payment_due: null,
          notes: 'Pembelian bahan baku bulan Maret',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      act(() => {
        usePurchaseStore.setState({ purchases: initialPurchases });
      });

      const updatedFields = {
        payment_status: 'paid',
      };

      const mockError = new Error('Failed to update purchase');

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => usePurchaseStore());

      await act(async () => {
        await result.current.updatePurchase('1', updatedFields);
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('purchases');
      expect(mockSupabase.update).toHaveBeenCalledWith(updatedFields);
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
      
      expect(result.current.purchases).toEqual(initialPurchases);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError.message);
    });
  });

  describe('deletePurchase', () => {
    it('should delete a purchase and update state', async () => {
      const initialPurchases: Purchase[] = [
        { 
          id: '1', 
          business_id: '1',
          supplier_id: '1',
          date: new Date().toISOString(),
          total_amount: 500000,
          payment_status: 'paid',
          payment_due: null,
          notes: 'Pembelian bahan baku bulan Maret',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { 
          id: '2', 
          business_id: '1',
          supplier_id: '2',
          date: new Date().toISOString(),
          total_amount: 750000,
          payment_status: 'unpaid',
          payment_due: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
          notes: 'Pembelian bahan baku bulan April',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      act(() => {
        usePurchaseStore.setState({ 
          purchases: initialPurchases,
          selectedPurchaseId: '1'
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

      const { result } = renderHook(() => usePurchaseStore());

      await act(async () => {
        await result.current.deletePurchase('1');
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('purchases');
      expect(mockSupabase.delete).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
      
      expect(result.current.purchases).toEqual([initialPurchases[1]]);
      expect(result.current.selectedPurchaseId).toBe(null);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle error when deleting a purchase', async () => {
      const initialPurchases: Purchase[] = [
        { 
          id: '1', 
          business_id: '1',
          supplier_id: '1',
          date: new Date().toISOString(),
          total_amount: 500000,
          payment_status: 'paid',
          payment_due: null,
          notes: 'Pembelian bahan baku bulan Maret',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      act(() => {
        usePurchaseStore.setState({ purchases: initialPurchases });
      });

      const mockError = new Error('Failed to delete purchase');

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => usePurchaseStore());

      await act(async () => {
        await result.current.deletePurchase('1');
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('purchases');
      expect(mockSupabase.delete).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
      
      expect(result.current.purchases).toEqual(initialPurchases);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError.message);
    });
  });
});
