import { renderHook, act } from '@testing-library/react';
import { createClient } from '@/lib/supabase/client';
import { Customer, useCustomerStore } from '@/hooks/use-customer-store';

// Mock the Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(),
}));

describe('useCustomerStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the store state
    act(() => {
      useCustomerStore.setState({
        customers: [],
        selectedCustomerId: null,
        isLoading: false,
        error: null,
      });
    });
  });

  describe('fetchCustomers', () => {
    it('should fetch customers and update state', async () => {
      const mockCustomers: Customer[] = [
        { 
          id: '1', 
          business_id: '1',
          name: 'John Doe',
          phone: '081234567890',
          email: 'john@example.com',
          address: 'Jl. Contoh No. 123',
          notes: 'Pelanggan tetap',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { 
          id: '2', 
          business_id: '1',
          name: 'Jane Smith',
          phone: '089876543210',
          email: 'jane@example.com',
          address: 'Jl. Sample No. 456',
          notes: 'Pelanggan baru',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
      ];

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue({
          data: mockCustomers,
          error: null,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useCustomerStore());

      await act(async () => {
        await result.current.fetchCustomers();
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('customers');
      expect(mockSupabase.select).toHaveBeenCalled();
      expect(result.current.customers).toEqual(mockCustomers);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle error when fetching customers', async () => {
      const mockError = new Error('Failed to fetch customers');
      
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useCustomerStore());

      await act(async () => {
        await result.current.fetchCustomers();
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('customers');
      expect(mockSupabase.select).toHaveBeenCalled();
      expect(result.current.customers).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError.message);
    });
  });

  describe('selectCustomer', () => {
    it('should update selectedCustomerId', () => {
      const { result } = renderHook(() => useCustomerStore());

      act(() => {
        result.current.selectCustomer('1');
      });

      expect(result.current.selectedCustomerId).toBe('1');
    });
  });

  describe('createCustomer', () => {
    it('should create a customer and update state', async () => {
      const newCustomer = {
        business_id: '1',
        name: 'New Customer',
        phone: '081122334455',
        email: 'new@example.com',
        address: 'Jl. Baru No. 789',
        notes: 'Pelanggan baru dari referensi',
      };

      const createdCustomer = {
        ...newCustomer,
        id: '3',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: createdCustomer,
          error: null,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useCustomerStore());

      await act(async () => {
        await result.current.createCustomer(newCustomer);
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('customers');
      expect(mockSupabase.insert).toHaveBeenCalledWith(newCustomer);
      expect(mockSupabase.select).toHaveBeenCalled();
      expect(result.current.customers).toEqual([createdCustomer]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle error when creating a customer', async () => {
      const newCustomer = {
        business_id: '1',
        name: 'Error Customer',
        phone: '081122334455',
        email: 'error@example.com',
        address: 'Jl. Error No. 404',
        notes: 'Pelanggan dengan error',
      };

      const mockError = new Error('Failed to create customer');

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

      const { result } = renderHook(() => useCustomerStore());

      await act(async () => {
        await result.current.createCustomer(newCustomer);
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('customers');
      expect(mockSupabase.insert).toHaveBeenCalledWith(newCustomer);
      expect(result.current.customers).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError.message);
    });
  });

  describe('updateCustomer', () => {
    it('should update a customer and update state', async () => {
      const initialCustomers: Customer[] = [
        { 
          id: '1', 
          business_id: '1',
          name: 'John Doe',
          phone: '081234567890',
          email: 'john@example.com',
          address: 'Jl. Contoh No. 123',
          notes: 'Pelanggan tetap',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      act(() => {
        useCustomerStore.setState({ customers: initialCustomers });
      });

      const updatedFields = {
        name: 'John Doe Updated',
        phone: '081234567899',
        notes: 'Pelanggan tetap yang diperbarui',
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

      const { result } = renderHook(() => useCustomerStore());

      await act(async () => {
        await result.current.updateCustomer('1', updatedFields);
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('customers');
      expect(mockSupabase.update).toHaveBeenCalledWith(updatedFields);
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
      
      expect(result.current.customers[0]).toEqual({
        ...initialCustomers[0],
        ...updatedFields,
      });
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle error when updating a customer', async () => {
      const initialCustomers: Customer[] = [
        { 
          id: '1', 
          business_id: '1',
          name: 'John Doe',
          phone: '081234567890',
          email: 'john@example.com',
          address: 'Jl. Contoh No. 123',
          notes: 'Pelanggan tetap',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      act(() => {
        useCustomerStore.setState({ customers: initialCustomers });
      });

      const updatedFields = {
        name: 'John Doe Error',
      };

      const mockError = new Error('Failed to update customer');

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useCustomerStore());

      await act(async () => {
        await result.current.updateCustomer('1', updatedFields);
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('customers');
      expect(mockSupabase.update).toHaveBeenCalledWith(updatedFields);
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
      
      expect(result.current.customers).toEqual(initialCustomers);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError.message);
    });
  });

  describe('deleteCustomer', () => {
    it('should delete a customer and update state', async () => {
      const initialCustomers: Customer[] = [
        { 
          id: '1', 
          business_id: '1',
          name: 'John Doe',
          phone: '081234567890',
          email: 'john@example.com',
          address: 'Jl. Contoh No. 123',
          notes: 'Pelanggan tetap',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { 
          id: '2', 
          business_id: '1',
          name: 'Jane Smith',
          phone: '089876543210',
          email: 'jane@example.com',
          address: 'Jl. Sample No. 456',
          notes: 'Pelanggan baru',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      act(() => {
        useCustomerStore.setState({ 
          customers: initialCustomers,
          selectedCustomerId: '1'
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

      const { result } = renderHook(() => useCustomerStore());

      await act(async () => {
        await result.current.deleteCustomer('1');
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('customers');
      expect(mockSupabase.delete).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
      
      expect(result.current.customers).toEqual([initialCustomers[1]]);
      expect(result.current.selectedCustomerId).toBe(null);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle error when deleting a customer', async () => {
      const initialCustomers: Customer[] = [
        { 
          id: '1', 
          business_id: '1',
          name: 'John Doe',
          phone: '081234567890',
          email: 'john@example.com',
          address: 'Jl. Contoh No. 123',
          notes: 'Pelanggan tetap',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      act(() => {
        useCustomerStore.setState({ customers: initialCustomers });
      });

      const mockError = new Error('Failed to delete customer');

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useCustomerStore());

      await act(async () => {
        await result.current.deleteCustomer('1');
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('customers');
      expect(mockSupabase.delete).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
      
      expect(result.current.customers).toEqual(initialCustomers);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError.message);
    });
  });
});
