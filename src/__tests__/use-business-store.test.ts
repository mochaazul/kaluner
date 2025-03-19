import { renderHook, act } from '@testing-library/react';
import { useBusinessStore, type Business } from '@/hooks/use-business-store';
import { createClient } from '@/lib/supabase/client';

// Mock the Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(),
}));

describe('useBusinessStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the store state
    act(() => {
      useBusinessStore.setState({
        businesses: [],
        selectedBusinessId: null,
        isLoading: false,
        error: null,
      });
    });
  });

  describe('fetchBusinesses', () => {
    it('should fetch businesses and update state', async () => {
      const mockBusinesses: Business[] = [
        { id: '1', name: 'Bisnis 1', description: 'Deskripsi 1', logo_url: null, address: null, phone: null, owner_id: 'user1' },
        { id: '2', name: 'Bisnis 2', description: 'Deskripsi 2', logo_url: null, address: null, phone: null, owner_id: 'user1' },
      ];

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue({
          data: mockBusinesses,
          error: null,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useBusinessStore());

      await act(async () => {
        await result.current.fetchBusinesses();
      });

      expect(result.current.businesses).toEqual(mockBusinesses);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(mockSupabase.from).toHaveBeenCalledWith('businesses');
      expect(mockSupabase.select).toHaveBeenCalledWith('*');
    });

    it('should handle errors when fetching businesses', async () => {
      const mockError = new Error('Database error');

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useBusinessStore());

      await act(async () => {
        await result.current.fetchBusinesses();
      });

      expect(result.current.businesses).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError.message);
    });
  });

  describe('selectBusiness', () => {
    it('should update selectedBusinessId', () => {
      const { result } = renderHook(() => useBusinessStore());

      act(() => {
        result.current.selectBusiness('1');
      });

      expect(result.current.selectedBusinessId).toBe('1');
    });
  });

  describe('createBusiness', () => {
    it('should create a business and update state', async () => {
      const newBusiness = {
        name: 'Bisnis Baru',
        description: 'Deskripsi bisnis baru',
        logo_url: null,
        address: null,
        phone: null,
        owner_id: 'user1',
      };

      const createdBusiness: Business = {
        id: '3',
        ...newBusiness,
      };

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: createdBusiness,
          error: null,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useBusinessStore());

      await act(async () => {
        await result.current.createBusiness(newBusiness);
      });

      expect(result.current.businesses).toEqual([createdBusiness]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(mockSupabase.from).toHaveBeenCalledWith('businesses');
      expect(mockSupabase.insert).toHaveBeenCalledWith(newBusiness);
    });
  });

  describe('updateBusiness', () => {
    it('should update a business and update state', async () => {
      const initialBusinesses: Business[] = [
        { id: '1', name: 'Bisnis 1', description: 'Deskripsi 1', logo_url: null, address: null, phone: null, owner_id: 'user1' },
      ];

      act(() => {
        useBusinessStore.setState({ businesses: initialBusinesses });
      });

      const updatedBusiness = {
        name: 'Bisnis 1 Updated',
        description: 'Deskripsi 1 Updated',
      };

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          error: null,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useBusinessStore());

      await act(async () => {
        await result.current.updateBusiness('1', updatedBusiness);
      });

      expect(result.current.businesses[0].name).toBe('Bisnis 1 Updated');
      expect(result.current.businesses[0].description).toBe('Deskripsi 1 Updated');
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(mockSupabase.from).toHaveBeenCalledWith('businesses');
      expect(mockSupabase.update).toHaveBeenCalledWith(updatedBusiness);
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
    });
  });

  describe('deleteBusiness', () => {
    it('should delete a business and update state', async () => {
      const initialBusinesses: Business[] = [
        { id: '1', name: 'Bisnis 1', description: 'Deskripsi 1', logo_url: null, address: null, phone: null, owner_id: 'user1' },
        { id: '2', name: 'Bisnis 2', description: 'Deskripsi 2', logo_url: null, address: null, phone: null, owner_id: 'user1' },
      ];

      act(() => {
        useBusinessStore.setState({ 
          businesses: initialBusinesses,
          selectedBusinessId: '1'
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

      const { result } = renderHook(() => useBusinessStore());

      await act(async () => {
        await result.current.deleteBusiness('1');
      });

      expect(result.current.businesses).toEqual([initialBusinesses[1]]);
      expect(result.current.selectedBusinessId).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(mockSupabase.from).toHaveBeenCalledWith('businesses');
      expect(mockSupabase.delete).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
    });
  });
});
