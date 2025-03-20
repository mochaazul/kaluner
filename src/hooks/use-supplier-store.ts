import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';

export type Supplier = {
  id: string;
  name: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  payment_terms: string | null;
  business_id: string;
  created_at: string;
  updated_at?: string;
};

type SupplierState = {
  suppliers: Supplier[];
  selectedSupplierId: string | null;
  isLoading: boolean;
  error: string | null;
};

type SupplierActions = {
  fetchSuppliers: () => Promise<void>;
  selectSupplier: (id: string) => void;
  createSupplier: (supplier: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;
};

export const useSupplierStore = create<SupplierState & SupplierActions>((set) => ({
  suppliers: [],
  selectedSupplierId: null,
  isLoading: false,
  error: null,

  fetchSuppliers: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('suppliers')
        .select('*');
      
      if (error) throw error;
      
      set({ 
        suppliers: data as unknown as Supplier[], 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat mengambil data pemasok', 
        isLoading: false 
      });
    }
  },
  
  selectSupplier: (id: string) => {
    set({ selectedSupplierId: id });
  },
  
  createSupplier: async (supplier) => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('suppliers')
        .insert(supplier)
        .select()
        .single();
      
      if (error) throw error;
      
      set((state) => ({ 
        suppliers: [...state.suppliers, data as unknown as Supplier], 
        isLoading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat membuat pemasok', 
        isLoading: false 
      });
    }
  },
  
  updateSupplier: async (id, supplier) => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('suppliers')
        .update(supplier)
        .eq('id', id);
      
      if (error) throw error;
      
      set((state) => ({
        suppliers: state.suppliers.map((item) => 
          item.id === id ? { ...item, ...supplier } : item
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat memperbarui pemasok', 
        isLoading: false 
      });
    }
  },
  
  deleteSupplier: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set((state) => ({
        suppliers: state.suppliers.filter((supplier) => supplier.id !== id),
        selectedSupplierId: state.selectedSupplierId === id ? null : state.selectedSupplierId,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat menghapus pemasok', 
        isLoading: false 
      });
    }
  },
}));
