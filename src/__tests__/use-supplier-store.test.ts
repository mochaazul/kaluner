import { renderHook, act } from '@testing-library/react';
import { createClient } from '@/lib/supabase/client';
import { Supplier, useSupplierStore } from '@/hooks/use-supplier-store';

// Mock the Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(),
}));

describe('useSupplierStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the store state
    act(() => {
      useSupplierStore.setState({
        suppliers: [],
        selectedSupplierId: null,
        isLoading: false,
        error: null,
      });
    });
  });

  describe('fetchSuppliers', () => {
    it('should fetch suppliers and update state', async () => {
      const mockSuppliers: Supplier[] = [
        { 
          id: '1', 
          name: 'PT Supplier Bahan Kue', 
          contact_person: 'John Doe',
          phone: '08123456789',
          email: 'john@supplier.com',
          address: 'Jl. Supplier No. 123',
          payment_terms: 'Net 30',
          business_id: '1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { 
          id: '2', 
          name: 'CV Bahan Berkualitas', 
          contact_person: 'Jane Smith',
          phone: '08987654321',
          email: 'jane@supplier.com',
          address: 'Jl. Berkualitas No. 456',
          payment_terms: 'COD',
          business_id: '1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
      ];

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue({
          data: mockSuppliers,
          error: null,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useSupplierStore());

      await act(async () => {
        await result.current.fetchSuppliers();
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('suppliers');
      expect(mockSupabase.select).toHaveBeenCalled();
      expect(result.current.suppliers).toEqual(mockSuppliers);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle error when fetching suppliers', async () => {
      const mockError = new Error('Failed to fetch suppliers');
      
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useSupplierStore());

      await act(async () => {
        await result.current.fetchSuppliers();
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('suppliers');
      expect(mockSupabase.select).toHaveBeenCalled();
      expect(result.current.suppliers).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError.message);
    });
  });

  describe('selectSupplier', () => {
    it('should update selectedSupplierId', () => {
      const { result } = renderHook(() => useSupplierStore());

      act(() => {
        result.current.selectSupplier('1');
      });

      expect(result.current.selectedSupplierId).toBe('1');
    });
  });

  describe('createSupplier', () => {
    it('should create a supplier and update state', async () => {
      const newSupplier = {
        name: 'PT Supplier Baru',
        contact_person: 'New Contact',
        phone: '08111222333',
        email: 'new@supplier.com',
        address: 'Jl. Baru No. 789',
        payment_terms: 'Net 15',
        business_id: '1',
      };

      const createdSupplier = {
        ...newSupplier,
        id: '3',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: createdSupplier,
          error: null,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useSupplierStore());

      await act(async () => {
        await result.current.createSupplier(newSupplier);
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('suppliers');
      expect(mockSupabase.insert).toHaveBeenCalledWith(newSupplier);
      expect(mockSupabase.select).toHaveBeenCalled();
      expect(result.current.suppliers).toEqual([createdSupplier]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle error when creating a supplier', async () => {
      const newSupplier = {
        name: 'PT Supplier Baru',
        contact_person: 'New Contact',
        phone: '08111222333',
        email: 'new@supplier.com',
        address: 'Jl. Baru No. 789',
        payment_terms: 'Net 15',
        business_id: '1',
      };

      const mockError = new Error('Failed to create supplier');

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

      const { result } = renderHook(() => useSupplierStore());

      await act(async () => {
        await result.current.createSupplier(newSupplier);
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('suppliers');
      expect(mockSupabase.insert).toHaveBeenCalledWith(newSupplier);
      expect(result.current.suppliers).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError.message);
    });
  });

  describe('updateSupplier', () => {
    it('should update a supplier and update state', async () => {
      const initialSuppliers: Supplier[] = [
        { 
          id: '1', 
          name: 'PT Supplier Bahan Kue', 
          contact_person: 'John Doe',
          phone: '08123456789',
          email: 'john@supplier.com',
          address: 'Jl. Supplier No. 123',
          payment_terms: 'Net 30',
          business_id: '1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      act(() => {
        useSupplierStore.setState({ suppliers: initialSuppliers });
      });

      const updatedFields = {
        name: 'PT Supplier Bahan Kue Updated',
        contact_person: 'John Doe Updated',
        phone: '08123456789 Updated',
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

      const { result } = renderHook(() => useSupplierStore());

      await act(async () => {
        await result.current.updateSupplier('1', updatedFields);
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('suppliers');
      expect(mockSupabase.update).toHaveBeenCalledWith(updatedFields);
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
      
      expect(result.current.suppliers[0]).toEqual({
        ...initialSuppliers[0],
        ...updatedFields,
      });
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle error when updating a supplier', async () => {
      const initialSuppliers: Supplier[] = [
        { 
          id: '1', 
          name: 'PT Supplier Bahan Kue', 
          contact_person: 'John Doe',
          phone: '08123456789',
          email: 'john@supplier.com',
          address: 'Jl. Supplier No. 123',
          payment_terms: 'Net 30',
          business_id: '1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      act(() => {
        useSupplierStore.setState({ suppliers: initialSuppliers });
      });

      const updatedFields = {
        name: 'PT Supplier Bahan Kue Updated',
      };

      const mockError = new Error('Failed to update supplier');

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useSupplierStore());

      await act(async () => {
        await result.current.updateSupplier('1', updatedFields);
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('suppliers');
      expect(mockSupabase.update).toHaveBeenCalledWith(updatedFields);
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
      
      expect(result.current.suppliers).toEqual(initialSuppliers);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError.message);
    });
  });

  describe('deleteSupplier', () => {
    it('should delete a supplier and update state', async () => {
      const initialSuppliers: Supplier[] = [
        { 
          id: '1', 
          name: 'PT Supplier Bahan Kue', 
          contact_person: 'John Doe',
          phone: '08123456789',
          email: 'john@supplier.com',
          address: 'Jl. Supplier No. 123',
          payment_terms: 'Net 30',
          business_id: '1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { 
          id: '2', 
          name: 'CV Bahan Berkualitas', 
          contact_person: 'Jane Smith',
          phone: '08987654321',
          email: 'jane@supplier.com',
          address: 'Jl. Berkualitas No. 456',
          payment_terms: 'COD',
          business_id: '1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      act(() => {
        useSupplierStore.setState({ 
          suppliers: initialSuppliers,
          selectedSupplierId: '1'
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

      const { result } = renderHook(() => useSupplierStore());

      await act(async () => {
        await result.current.deleteSupplier('1');
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('suppliers');
      expect(mockSupabase.delete).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
      
      expect(result.current.suppliers).toEqual([initialSuppliers[1]]);
      expect(result.current.selectedSupplierId).toBe(null);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle error when deleting a supplier', async () => {
      const initialSuppliers: Supplier[] = [
        { 
          id: '1', 
          name: 'PT Supplier Bahan Kue', 
          contact_person: 'John Doe',
          phone: '08123456789',
          email: 'john@supplier.com',
          address: 'Jl. Supplier No. 123',
          payment_terms: 'Net 30',
          business_id: '1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      act(() => {
        useSupplierStore.setState({ suppliers: initialSuppliers });
      });

      const mockError = new Error('Failed to delete supplier');

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useSupplierStore());

      await act(async () => {
        await result.current.deleteSupplier('1');
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('suppliers');
      expect(mockSupabase.delete).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
      
      expect(result.current.suppliers).toEqual(initialSuppliers);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError.message);
    });
  });
});
