import { renderHook, act } from '@testing-library/react';
import { createClient } from '@/lib/supabase/client';
import { Sale, SaleItem, NewSale, NewSaleItem, useSalesStore } from '@/hooks/use-sales-store';

// Mock the Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(),
}));

describe('useSalesStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the store state
    act(() => {
      useSalesStore.setState({
        sales: [],
        saleItems: [],
        selectedSaleId: null,
        isLoading: false,
        error: null,
      });
    });
  });

  describe('fetchSales', () => {
    it('should fetch sales and update state', async () => {
      const mockSales: Sale[] = [
        { 
          id: '1', 
          date: new Date().toISOString(),
          total_amount: 50000,
          discount_amount: 0,
          tax_amount: 0,
          payment_method: 'cash',
          business_id: '1',
          customer_id: null,
          notes: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { 
          id: '2', 
          date: new Date().toISOString(),
          total_amount: 75000,
          discount_amount: 5000,
          tax_amount: 7500,
          payment_method: 'transfer',
          business_id: '1',
          customer_id: '1',
          notes: 'Pesanan untuk acara keluarga',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
      ];

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue({
          data: mockSales,
          error: null,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useSalesStore());

      await act(async () => {
        await result.current.fetchSales();
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('sales');
      expect(mockSupabase.select).toHaveBeenCalled();
      expect(result.current.sales).toEqual(mockSales);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle error when fetching sales', async () => {
      const mockError = new Error('Failed to fetch sales');
      
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useSalesStore());

      await act(async () => {
        await result.current.fetchSales();
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('sales');
      expect(mockSupabase.select).toHaveBeenCalled();
      expect(result.current.sales).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError.message);
    });
  });

  describe('fetchSaleItems', () => {
    it('should fetch sale items for a specific sale and update state', async () => {
      const saleId = '1';
      const mockSaleItems: SaleItem[] = [
        { 
          id: '1', 
          sale_id: saleId,
          menu_item_id: '1',
          quantity: 2,
          unit_price: 25000,
          discount: 0,
          subtotal: 50000,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { 
          id: '2', 
          sale_id: saleId,
          menu_item_id: '2',
          quantity: 3,
          unit_price: 5000,
          discount: 0,
          subtotal: 15000,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
      ];

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: mockSaleItems,
          error: null,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useSalesStore());

      await act(async () => {
        await result.current.fetchSaleItems(saleId);
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('sale_items');
      expect(mockSupabase.select).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('sale_id', saleId);
      expect(result.current.saleItems).toEqual(mockSaleItems);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle error when fetching sale items', async () => {
      const saleId = '1';
      const mockError = new Error('Failed to fetch sale items');
      
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useSalesStore());

      await act(async () => {
        await result.current.fetchSaleItems(saleId);
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('sale_items');
      expect(mockSupabase.select).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('sale_id', saleId);
      expect(result.current.saleItems).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError.message);
    });
  });

  describe('selectSale', () => {
    it('should update selectedSaleId', () => {
      const { result } = renderHook(() => useSalesStore());

      act(() => {
        result.current.selectSale('1');
      });

      expect(result.current.selectedSaleId).toBe('1');
    });
  });

  describe('createSale', () => {
    it('should create a sale with items and update state', async () => {
      const newSale: NewSale = {
        date: new Date().toISOString(),
        total_amount: 65000,
        discount_amount: 0,
        tax_amount: 0,
        payment_method: 'cash',
        business_id: '1',
        customer_id: null,
        notes: 'Pesanan baru',
      };

      const newSaleItems: Omit<NewSaleItem, 'sale_id'>[] = [
        {
          menu_item_id: '1',
          quantity: 2,
          unit_price: 25000,
          discount: 0,
          subtotal: 50000,
        },
        {
          menu_item_id: '3',
          quantity: 1,
          unit_price: 15000,
          discount: 0,
          subtotal: 15000,
        }
      ];

      const createdSale = {
        id: '3',
        date: newSale.date || new Date().toISOString(),
        total_amount: newSale.total_amount,
        discount_amount: newSale.discount_amount || 0,
        tax_amount: newSale.tax_amount || 0,
        payment_method: newSale.payment_method,
        business_id: newSale.business_id,
        customer_id: newSale.customer_id,
        notes: newSale.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Sale;

      const createdSaleItems = newSaleItems.map((item, index) => ({
        ...item,
        id: `${index + 10}`,
        sale_id: '3',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })) as SaleItem[];

      // Mock for creating sale
      const mockSupabaseForSale = {
        from: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: createdSale,
          error: null,
        }),
      };

      // Mock for creating sale items
      const mockSupabaseForItems = {
        from: jest.fn().mockReturnThis(),
        insert: jest.fn().mockResolvedValue({
          data: createdSaleItems,
          error: null,
        }),
      };

      (createClient as jest.Mock)
        .mockReturnValueOnce(mockSupabaseForSale)
        .mockReturnValueOnce(mockSupabaseForItems);

      const { result } = renderHook(() => useSalesStore());

      await act(async () => {
        await result.current.createSale(newSale, newSaleItems as NewSaleItem[]);
      });

      expect(createClient).toHaveBeenCalledTimes(2);
      expect(mockSupabaseForSale.from).toHaveBeenCalledWith('sales');
      expect(mockSupabaseForSale.insert).toHaveBeenCalledWith(newSale);
      
      expect(mockSupabaseForItems.from).toHaveBeenCalledWith('sale_items');
      expect(mockSupabaseForItems.insert).toHaveBeenCalledWith(
        newSaleItems.map(item => ({ ...item, sale_id: createdSale.id }))
      );
      
      expect(result.current.sales).toEqual([createdSale]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle error when creating a sale', async () => {
      const newSale: NewSale = {
        date: new Date().toISOString(),
        total_amount: 65000,
        discount_amount: 0,
        tax_amount: 0,
        payment_method: 'cash',
        business_id: '1',
        customer_id: null,
        notes: 'Pesanan baru',
      };

      const newSaleItems: Omit<NewSaleItem, 'sale_id'>[] = [
        {
          menu_item_id: '1',
          quantity: 2,
          unit_price: 25000,
          discount: 0,
          subtotal: 50000,
        }
      ];

      const mockError = new Error('Failed to create sale');

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

      const { result } = renderHook(() => useSalesStore());

      await act(async () => {
        await result.current.createSale(newSale, newSaleItems as NewSaleItem[]);
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('sales');
      expect(mockSupabase.insert).toHaveBeenCalledWith(newSale);
      expect(result.current.sales).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError.message);
    });
  });

  describe('updateSale', () => {
    it('should update a sale and update state', async () => {
      const initialSales: Sale[] = [
        { 
          id: '1', 
          date: new Date().toISOString(),
          total_amount: 50000,
          discount_amount: 0,
          tax_amount: 0,
          payment_method: 'cash',
          business_id: '1',
          customer_id: null,
          notes: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      act(() => {
        useSalesStore.setState({ sales: initialSales });
      });

      const updatedFields = {
        total_amount: 55000,
        notes: 'Diperbarui',
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

      const { result } = renderHook(() => useSalesStore());

      await act(async () => {
        await result.current.updateSale('1', updatedFields);
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('sales');
      expect(mockSupabase.update).toHaveBeenCalledWith(updatedFields);
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
      
      expect(result.current.sales[0]).toEqual({
        ...initialSales[0],
        ...updatedFields,
      });
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle error when updating a sale', async () => {
      const initialSales: Sale[] = [
        { 
          id: '1', 
          date: new Date().toISOString(),
          total_amount: 50000,
          discount_amount: 0,
          tax_amount: 0,
          payment_method: 'cash',
          business_id: '1',
          customer_id: null,
          notes: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      act(() => {
        useSalesStore.setState({ sales: initialSales });
      });

      const updatedFields = {
        total_amount: 55000,
      };

      const mockError = new Error('Failed to update sale');

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useSalesStore());

      await act(async () => {
        await result.current.updateSale('1', updatedFields);
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('sales');
      expect(mockSupabase.update).toHaveBeenCalledWith(updatedFields);
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
      
      expect(result.current.sales).toEqual(initialSales);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError.message);
    });
  });

  describe('deleteSale', () => {
    it('should delete a sale and update state', async () => {
      const initialSales: Sale[] = [
        { 
          id: '1', 
          date: new Date().toISOString(),
          total_amount: 50000,
          discount_amount: 0,
          tax_amount: 0,
          payment_method: 'cash',
          business_id: '1',
          customer_id: null,
          notes: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { 
          id: '2', 
          date: new Date().toISOString(),
          total_amount: 75000,
          discount_amount: 5000,
          tax_amount: 7500,
          payment_method: 'transfer',
          business_id: '1',
          customer_id: '1',
          notes: 'Pesanan untuk acara keluarga',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      act(() => {
        useSalesStore.setState({ 
          sales: initialSales,
          selectedSaleId: '1'
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

      const { result } = renderHook(() => useSalesStore());

      await act(async () => {
        await result.current.deleteSale('1');
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('sales');
      expect(mockSupabase.delete).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
      
      expect(result.current.sales).toEqual([initialSales[1]]);
      expect(result.current.selectedSaleId).toBe(null);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle error when deleting a sale', async () => {
      const initialSales: Sale[] = [
        { 
          id: '1', 
          date: new Date().toISOString(),
          total_amount: 50000,
          discount_amount: 0,
          tax_amount: 0,
          payment_method: 'cash',
          business_id: '1',
          customer_id: null,
          notes: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      act(() => {
        useSalesStore.setState({ sales: initialSales });
      });

      const mockError = new Error('Failed to delete sale');

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useSalesStore());

      await act(async () => {
        await result.current.deleteSale('1');
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('sales');
      expect(mockSupabase.delete).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
      
      expect(result.current.sales).toEqual(initialSales);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError.message);
    });
  });
});
