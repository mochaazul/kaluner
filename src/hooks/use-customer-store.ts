import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/database.types';

export type Customer = Database['public']['Tables']['customers']['Row'];
export type NewCustomer = Database['public']['Tables']['customers']['Insert'];
export type UpdateCustomer = Database['public']['Tables']['customers']['Update'];

type CustomerState = {
  customers: Customer[];
  selectedCustomerId: string | null;
  isLoading: boolean;
  error: string | null;
};

type CustomerActions = {
  fetchCustomers: () => Promise<void>;
  selectCustomer: (id: string) => void;
  createCustomer: (customer: NewCustomer) => Promise<void>;
  updateCustomer: (id: string, customer: UpdateCustomer) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
};

export const useCustomerStore = create<CustomerState & CustomerActions>((set) => ({
  customers: [],
  selectedCustomerId: null,
  isLoading: false,
  error: null,

  fetchCustomers: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('customers')
        .select('*');
      
      if (error) throw error;
      
      set({ 
        customers: data as unknown as Customer[], 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat mengambil data pelanggan', 
        isLoading: false 
      });
    }
  },
  
  selectCustomer: (id: string) => {
    set({ selectedCustomerId: id });
  },
  
  createCustomer: async (customer: NewCustomer) => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('customers')
        .insert(customer)
        .select()
        .single();
      
      if (error) throw error;
      
      set((state) => ({ 
        customers: [...state.customers, data as unknown as Customer], 
        isLoading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat membuat pelanggan baru', 
        isLoading: false 
      });
    }
  },
  
  updateCustomer: async (id: string, customer: UpdateCustomer) => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('customers')
        .update(customer)
        .eq('id', id);
      
      if (error) throw error;
      
      set((state) => ({
        customers: state.customers.map((item) => 
          item.id === id ? { ...item, ...customer } : item
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat memperbarui pelanggan', 
        isLoading: false 
      });
    }
  },
  
  deleteCustomer: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set((state) => ({
        customers: state.customers.filter((customer) => customer.id !== id),
        selectedCustomerId: state.selectedCustomerId === id ? null : state.selectedCustomerId,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat menghapus pelanggan', 
        isLoading: false 
      });
    }
  },
}));
