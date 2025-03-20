import { renderHook, act } from '@testing-library/react';
import { createClient } from '@/lib/supabase/client';
import { BusinessSetting, NewBusinessSetting, useBusinessSettingStore } from '@/hooks/use-business-setting-store';

// Mock the Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(),
}));

describe('useBusinessSettingStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the store state
    act(() => {
      useBusinessSettingStore.setState({
        businessSettings: [],
        isLoading: false,
        error: null,
      });
    });
  });

  describe('fetchBusinessSettings', () => {
    it('should fetch business settings for a specific business and update state', async () => {
      const businessId = '1';
      const mockBusinessSettings: BusinessSetting[] = [
        { 
          id: '1', 
          business_id: businessId,
          setting_key: 'tax_rate',
          setting_value: 10,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { 
          id: '2', 
          business_id: businessId,
          setting_key: 'currency',
          setting_value: 'IDR',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
      ];

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: mockBusinessSettings,
          error: null,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useBusinessSettingStore());

      await act(async () => {
        await result.current.fetchBusinessSettings(businessId);
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('business_settings');
      expect(mockSupabase.select).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('business_id', businessId);
      expect(result.current.businessSettings).toEqual(mockBusinessSettings);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle error when fetching business settings', async () => {
      const businessId = '1';
      const mockError = new Error('Failed to fetch business settings');
      
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useBusinessSettingStore());

      await act(async () => {
        await result.current.fetchBusinessSettings(businessId);
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('business_settings');
      expect(mockSupabase.select).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('business_id', businessId);
      expect(result.current.businessSettings).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError.message);
    });
  });

  describe('getSetting', () => {
    it('should return the setting value for a specific key', () => {
      const mockBusinessSettings: BusinessSetting[] = [
        { 
          id: '1', 
          business_id: '1',
          setting_key: 'tax_rate',
          setting_value: 10,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { 
          id: '2', 
          business_id: '1',
          setting_key: 'currency',
          setting_value: 'IDR',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
      ];

      act(() => {
        useBusinessSettingStore.setState({ businessSettings: mockBusinessSettings });
      });

      const { result } = renderHook(() => useBusinessSettingStore());
      
      expect(result.current.getSetting('tax_rate')).toBe(10);
      expect(result.current.getSetting('currency')).toBe('IDR');
      expect(result.current.getSetting('non_existent')).toBe(null);
    });
  });

  describe('updateSetting', () => {
    it('should update an existing setting and update state', async () => {
      const initialSettings: BusinessSetting[] = [
        { 
          id: '1', 
          business_id: '1',
          setting_key: 'tax_rate',
          setting_value: 10,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      act(() => {
        useBusinessSettingStore.setState({ businessSettings: initialSettings });
      });

      const updatedValue = 11;

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        eq2: jest.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useBusinessSettingStore());

      await act(async () => {
        await result.current.updateSetting('1', 'tax_rate', updatedValue);
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('business_settings');
      expect(mockSupabase.update).toHaveBeenCalledWith({ setting_value: updatedValue });
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
      
      expect(result.current.businessSettings[0].setting_value).toBe(updatedValue);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle error when updating a setting', async () => {
      const initialSettings: BusinessSetting[] = [
        { 
          id: '1', 
          business_id: '1',
          setting_key: 'tax_rate',
          setting_value: 10,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      act(() => {
        useBusinessSettingStore.setState({ businessSettings: initialSettings });
      });

      const updatedValue = 11;
      const mockError = new Error('Failed to update setting');

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useBusinessSettingStore());

      await act(async () => {
        await result.current.updateSetting('1', 'tax_rate', updatedValue);
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('business_settings');
      expect(mockSupabase.update).toHaveBeenCalledWith({ setting_value: updatedValue });
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
      
      expect(result.current.businessSettings[0].setting_value).toBe(10); // Should not change
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError.message);
    });
  });

  describe('createSetting', () => {
    it('should create a new setting and update state', async () => {
      const newSetting: NewBusinessSetting = {
        business_id: '1',
        setting_key: 'discount_rate',
        setting_value: 5,
      };

      const createdSetting = {
        ...newSetting,
        id: '3',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: createdSetting,
          error: null,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useBusinessSettingStore());

      await act(async () => {
        await result.current.createSetting(newSetting);
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('business_settings');
      expect(mockSupabase.insert).toHaveBeenCalledWith(newSetting);
      expect(mockSupabase.select).toHaveBeenCalled();
      expect(mockSupabase.single).toHaveBeenCalled();
      
      expect(result.current.businessSettings).toEqual([createdSetting]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle error when creating a setting', async () => {
      const newSetting: NewBusinessSetting = {
        business_id: '1',
        setting_key: 'discount_rate',
        setting_value: 5,
      };

      const mockError = new Error('Failed to create setting');

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

      const { result } = renderHook(() => useBusinessSettingStore());

      await act(async () => {
        await result.current.createSetting(newSetting);
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('business_settings');
      expect(mockSupabase.insert).toHaveBeenCalledWith(newSetting);
      expect(mockSupabase.select).toHaveBeenCalled();
      expect(mockSupabase.single).toHaveBeenCalled();
      
      expect(result.current.businessSettings).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError.message);
    });
  });

  describe('deleteSetting', () => {
    it('should delete a setting and update state', async () => {
      const initialSettings: BusinessSetting[] = [
        { 
          id: '1', 
          business_id: '1',
          setting_key: 'tax_rate',
          setting_value: 10,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { 
          id: '2', 
          business_id: '1',
          setting_key: 'currency',
          setting_value: 'IDR',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      act(() => {
        useBusinessSettingStore.setState({ businessSettings: initialSettings });
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

      const { result } = renderHook(() => useBusinessSettingStore());

      await act(async () => {
        await result.current.deleteSetting('1');
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('business_settings');
      expect(mockSupabase.delete).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
      
      expect(result.current.businessSettings).toEqual([initialSettings[1]]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle error when deleting a setting', async () => {
      const initialSettings: BusinessSetting[] = [
        { 
          id: '1', 
          business_id: '1',
          setting_key: 'tax_rate',
          setting_value: 10,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      act(() => {
        useBusinessSettingStore.setState({ businessSettings: initialSettings });
      });

      const mockError = new Error('Failed to delete setting');

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useBusinessSettingStore());

      await act(async () => {
        await result.current.deleteSetting('1');
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('business_settings');
      expect(mockSupabase.delete).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
      
      expect(result.current.businessSettings).toEqual(initialSettings);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError.message);
    });
  });
});
