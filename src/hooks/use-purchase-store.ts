import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/database.types';

export type Purchase = Database['public']['Tables']['purchases']['Row'];
export type NewPurchase = Database['public']['Tables']['purchases']['Insert'];
export type UpdatePurchase = Database['public']['Tables']['purchases']['Update'];

export type PurchaseItem = Database['public']['Tables']['purchase_items']['Row'];
export type NewPurchaseItem = Database['public']['Tables']['purchase_items']['Insert'];
export type UpdatePurchaseItem = Database['public']['Tables']['purchase_items']['Update'];

type PurchaseState = {
  purchases: Purchase[];
  purchaseItems: PurchaseItem[];
  selectedPurchaseId: string | null;
  isLoading: boolean;
  error: string | null;
};

type PurchaseActions = {
  fetchPurchases: () => Promise<void>;
  fetchPurchaseItems: (purchaseId: string) => Promise<void>;
  selectPurchase: (id: string) => void;
  createPurchase: (purchase: NewPurchase, purchaseItems: Omit<NewPurchaseItem, 'purchase_id'>[]) => Promise<void>;
  updatePurchase: (id: string, purchase: UpdatePurchase) => Promise<void>;
  deletePurchase: (id: string) => Promise<void>;
};

export const usePurchaseStore = create<PurchaseState & PurchaseActions>((set) => ({
  purchases: [],
  purchaseItems: [],
  selectedPurchaseId: null,
  isLoading: false,
  error: null,

  fetchPurchases: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('purchases')
        .select('*');
      
      if (error) throw error;
      
      set({ 
        purchases: data as unknown as Purchase[], 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat mengambil data pembelian', 
        isLoading: false 
      });
    }
  },

  fetchPurchaseItems: async (purchaseId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('purchase_items')
        .select('*')
        .eq('purchase_id', purchaseId);
      
      if (error) throw error;
      
      set({ 
        purchaseItems: data as unknown as PurchaseItem[], 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat mengambil data item pembelian', 
        isLoading: false 
      });
    }
  },
  
  selectPurchase: (id: string) => {
    set({ selectedPurchaseId: id });
  },
  
  createPurchase: async (purchase: NewPurchase, purchaseItems: Omit<NewPurchaseItem, 'purchase_id'>[]) => {
    set({ isLoading: true, error: null });
    
    try {
      // Create purchase
      const supabase = createClient();
      const { data: createdPurchase, error: purchaseError } = await supabase
        .from('purchases')
        .insert(purchase)
        .select()
        .single();
      
      if (purchaseError) throw purchaseError;
      
      // Create purchase items
      const purchaseId = createdPurchase.id;
      const itemsWithPurchaseId = purchaseItems.map(item => ({
        ...item,
        purchase_id: purchaseId,
      }));
      
      // Create a new supabase client for purchase items
      const supabaseForItems = createClient();
      const { data: createdItems, error: itemsError } = await supabaseForItems
        .from('purchase_items')
        .insert(itemsWithPurchaseId);
      
      if (itemsError) throw itemsError;
      
      set((state) => ({ 
        purchases: [...state.purchases, createdPurchase as unknown as Purchase],
        purchaseItems: [...state.purchaseItems, ...(createdItems as unknown as PurchaseItem[])],
        isLoading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat membuat pembelian baru', 
        isLoading: false 
      });
    }
  },
  
  updatePurchase: async (id: string, purchase: UpdatePurchase) => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('purchases')
        .update(purchase)
        .eq('id', id);
      
      if (error) throw error;
      
      set((state) => ({
        purchases: state.purchases.map((item) => 
          item.id === id ? { ...item, ...purchase } : item
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat memperbarui pembelian', 
        isLoading: false 
      });
    }
  },
  
  deletePurchase: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('purchases')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set((state) => ({
        purchases: state.purchases.filter((purchase) => purchase.id !== id),
        purchaseItems: state.purchaseItems.filter((item) => item.purchase_id !== id),
        selectedPurchaseId: state.selectedPurchaseId === id ? null : state.selectedPurchaseId,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat menghapus pembelian', 
        isLoading: false 
      });
    }
  },
}));
