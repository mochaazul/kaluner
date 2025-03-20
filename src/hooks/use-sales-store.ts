import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/database.types';

export type Sale = Database['public']['Tables']['sales']['Row'];

export type SaleItem = Database['public']['Tables']['sale_items']['Row'];

// Menggunakan tipe Insert dari database.types.ts untuk SaleItem
export type NewSaleItem = Database['public']['Tables']['sale_items']['Insert'];

// Menggunakan tipe Insert dari database.types.ts
export type NewSale = Database['public']['Tables']['sales']['Insert'];

// Menggunakan tipe Update dari database.types.ts
export type UpdateSale = Database['public']['Tables']['sales']['Update'];

type SalesState = {
  sales: Sale[];
  saleItems: SaleItem[];
  selectedSaleId: string | null;
  isLoading: boolean;
  error: string | null;
};

type SalesActions = {
  fetchSales: () => Promise<void>;
  fetchSaleItems: (saleId: string) => Promise<void>;
  selectSale: (id: string) => void;
  createSale: (sale: NewSale, items: NewSaleItem[]) => Promise<void>;
  updateSale: (id: string, sale: UpdateSale) => Promise<void>;
  deleteSale: (id: string) => Promise<void>;
};

export const useSalesStore = create<SalesState & SalesActions>((set) => ({
  sales: [],
  saleItems: [],
  selectedSaleId: null,
  isLoading: false,
  error: null,

  fetchSales: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('sales')
        .select('*');
      
      if (error) throw error;
      
      set({ 
        sales: data as unknown as Sale[], 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat mengambil data penjualan', 
        isLoading: false 
      });
    }
  },

  fetchSaleItems: async (saleId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('sale_items')
        .select('*')
        .eq('sale_id', saleId);
      
      if (error) throw error;
      
      set({ 
        saleItems: data as unknown as SaleItem[], 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat mengambil data item penjualan', 
        isLoading: false 
      });
    }
  },
  
  selectSale: (id: string) => {
    set({ selectedSaleId: id });
  },
  
  createSale: async (sale, items) => {
    set({ isLoading: true, error: null });
    
    try {
      // Create sale first
      const supabase = createClient();
      const { data, error } = await supabase
        .from('sales')
        .insert(sale)
        .select()
        .single();
      
      if (error) throw error;
      
      const createdSale = data as unknown as Sale;
      
      // Then create sale items with the new sale_id
      const saleItemsWithSaleId = items.map(item => ({
        ...item,
        sale_id: createdSale.id
      })) as Database['public']['Tables']['sale_items']['Insert'][];
      
      const { error: itemsError } = await createClient()
        .from('sale_items')
        .insert(saleItemsWithSaleId);
      
      if (itemsError) throw itemsError;
      
      set((state) => ({ 
        sales: [...state.sales, createdSale], 
        isLoading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat membuat penjualan', 
        isLoading: false 
      });
    }
  },
  
  updateSale: async (id, sale) => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('sales')
        .update(sale)
        .eq('id', id);
      
      if (error) throw error;
      
      set((state) => ({
        sales: state.sales.map((item) => 
          item.id === id ? { ...item, ...sale } : item
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat memperbarui penjualan', 
        isLoading: false 
      });
    }
  },
  
  deleteSale: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set((state) => ({
        sales: state.sales.filter((sale) => sale.id !== id),
        selectedSaleId: state.selectedSaleId === id ? null : state.selectedSaleId,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat menghapus penjualan', 
        isLoading: false 
      });
    }
  },
}));
