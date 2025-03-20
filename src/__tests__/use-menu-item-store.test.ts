import { renderHook, act } from '@testing-library/react';
import { createClient } from '@/lib/supabase/client';
import { MenuItem, useMenuItemStore } from '@/hooks/use-menu-item-store';

// Mock the Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(),
}));

describe('useMenuItemStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the store state
    act(() => {
      useMenuItemStore.setState({
        menuItems: [],
        selectedMenuItemId: null,
        isLoading: false,
        error: null,
      });
    });
  });

  describe('fetchMenuItems', () => {
    it('should fetch menu items and update state', async () => {
      const mockMenuItems: MenuItem[] = [
        { 
          id: '1', 
          name: 'Nasi Goreng Spesial', 
          description: 'Nasi goreng dengan telur dan ayam',
          category: 'Makanan Utama',
          selling_price: 25000,
          cost_price: 15000,
          profit_margin: 10000,
          is_active: true,
          business_id: '1',
          recipe_id: '1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { 
          id: '2', 
          name: 'Es Teh Manis', 
          description: 'Teh manis dingin',
          category: 'Minuman',
          selling_price: 5000,
          cost_price: 2000,
          profit_margin: 3000,
          is_active: true,
          business_id: '1',
          recipe_id: '2',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
      ];

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue({
          data: mockMenuItems,
          error: null,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useMenuItemStore());

      await act(async () => {
        await result.current.fetchMenuItems();
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('menu_items');
      expect(mockSupabase.select).toHaveBeenCalled();
      expect(result.current.menuItems).toEqual(mockMenuItems);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle error when fetching menu items', async () => {
      const mockError = new Error('Failed to fetch menu items');
      
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useMenuItemStore());

      await act(async () => {
        await result.current.fetchMenuItems();
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('menu_items');
      expect(mockSupabase.select).toHaveBeenCalled();
      expect(result.current.menuItems).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError.message);
    });
  });

  describe('selectMenuItem', () => {
    it('should update selectedMenuItemId', () => {
      const { result } = renderHook(() => useMenuItemStore());

      act(() => {
        result.current.selectMenuItem('1');
      });

      expect(result.current.selectedMenuItemId).toBe('1');
    });
  });

  describe('createMenuItem', () => {
    it('should create a menu item and update state', async () => {
      const newMenuItem = {
        name: 'Ayam Goreng',
        description: 'Ayam goreng renyah',
        category: 'Makanan Utama',
        selling_price: 20000,
        cost_price: 12000,
        profit_margin: 8000,
        is_active: true,
        business_id: '1',
        recipe_id: '3',
      };

      const createdMenuItem = {
        ...newMenuItem,
        id: '3',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: createdMenuItem,
          error: null,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useMenuItemStore());

      await act(async () => {
        await result.current.createMenuItem(newMenuItem);
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('menu_items');
      expect(mockSupabase.insert).toHaveBeenCalledWith(newMenuItem);
      expect(mockSupabase.select).toHaveBeenCalled();
      expect(result.current.menuItems).toEqual([createdMenuItem]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle error when creating a menu item', async () => {
      const newMenuItem = {
        name: 'Ayam Goreng',
        description: 'Ayam goreng renyah',
        category: 'Makanan Utama',
        selling_price: 20000,
        cost_price: 12000,
        profit_margin: 8000,
        is_active: true,
        business_id: '1',
        recipe_id: '3',
      };

      const mockError = new Error('Failed to create menu item');

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

      const { result } = renderHook(() => useMenuItemStore());

      await act(async () => {
        await result.current.createMenuItem(newMenuItem);
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('menu_items');
      expect(mockSupabase.insert).toHaveBeenCalledWith(newMenuItem);
      expect(result.current.menuItems).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError.message);
    });
  });

  describe('updateMenuItem', () => {
    it('should update a menu item and update state', async () => {
      const initialMenuItems: MenuItem[] = [
        { 
          id: '1', 
          name: 'Nasi Goreng Spesial', 
          description: 'Nasi goreng dengan telur dan ayam',
          category: 'Makanan Utama',
          selling_price: 25000,
          cost_price: 15000,
          profit_margin: 10000,
          is_active: true,
          business_id: '1',
          recipe_id: '1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      act(() => {
        useMenuItemStore.setState({ menuItems: initialMenuItems });
      });

      const updatedFields = {
        name: 'Nasi Goreng Super Spesial',
        selling_price: 30000,
        cost_price: 18000,
        profit_margin: 12000,
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

      const { result } = renderHook(() => useMenuItemStore());

      await act(async () => {
        await result.current.updateMenuItem('1', updatedFields);
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('menu_items');
      expect(mockSupabase.update).toHaveBeenCalledWith(updatedFields);
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
      
      expect(result.current.menuItems[0]).toEqual({
        ...initialMenuItems[0],
        ...updatedFields,
      });
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle error when updating a menu item', async () => {
      const initialMenuItems: MenuItem[] = [
        { 
          id: '1', 
          name: 'Nasi Goreng Spesial', 
          description: 'Nasi goreng dengan telur dan ayam',
          category: 'Makanan Utama',
          selling_price: 25000,
          cost_price: 15000,
          profit_margin: 10000,
          is_active: true,
          business_id: '1',
          recipe_id: '1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      act(() => {
        useMenuItemStore.setState({ menuItems: initialMenuItems });
      });

      const updatedFields = {
        name: 'Nasi Goreng Super Spesial',
      };

      const mockError = new Error('Failed to update menu item');

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useMenuItemStore());

      await act(async () => {
        await result.current.updateMenuItem('1', updatedFields);
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('menu_items');
      expect(mockSupabase.update).toHaveBeenCalledWith(updatedFields);
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
      
      expect(result.current.menuItems).toEqual(initialMenuItems);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError.message);
    });
  });

  describe('deleteMenuItem', () => {
    it('should delete a menu item and update state', async () => {
      const initialMenuItems: MenuItem[] = [
        { 
          id: '1', 
          name: 'Nasi Goreng Spesial', 
          description: 'Nasi goreng dengan telur dan ayam',
          category: 'Makanan Utama',
          selling_price: 25000,
          cost_price: 15000,
          profit_margin: 10000,
          is_active: true,
          business_id: '1',
          recipe_id: '1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { 
          id: '2', 
          name: 'Es Teh Manis', 
          description: 'Teh manis dingin',
          category: 'Minuman',
          selling_price: 5000,
          cost_price: 2000,
          profit_margin: 3000,
          is_active: true,
          business_id: '1',
          recipe_id: '2',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      act(() => {
        useMenuItemStore.setState({ 
          menuItems: initialMenuItems,
          selectedMenuItemId: '1'
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

      const { result } = renderHook(() => useMenuItemStore());

      await act(async () => {
        await result.current.deleteMenuItem('1');
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('menu_items');
      expect(mockSupabase.delete).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
      
      expect(result.current.menuItems).toEqual([initialMenuItems[1]]);
      expect(result.current.selectedMenuItemId).toBe(null);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle error when deleting a menu item', async () => {
      const initialMenuItems: MenuItem[] = [
        { 
          id: '1', 
          name: 'Nasi Goreng Spesial', 
          description: 'Nasi goreng dengan telur dan ayam',
          category: 'Makanan Utama',
          selling_price: 25000,
          cost_price: 15000,
          profit_margin: 10000,
          is_active: true,
          business_id: '1',
          recipe_id: '1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      act(() => {
        useMenuItemStore.setState({ menuItems: initialMenuItems });
      });

      const mockError = new Error('Failed to delete menu item');

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useMenuItemStore());

      await act(async () => {
        await result.current.deleteMenuItem('1');
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('menu_items');
      expect(mockSupabase.delete).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
      
      expect(result.current.menuItems).toEqual(initialMenuItems);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError.message);
    });
  });
});
