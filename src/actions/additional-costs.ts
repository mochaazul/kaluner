'use server';

import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { revalidatePath } from 'next/cache';
import { AdditionalCost } from '@/lib/types/recipe';

// Fungsi untuk mendapatkan semua biaya tambahan untuk resep tertentu
export async function getAdditionalCostsByRecipeId(recipeId: string) {
  try {
    const supabase = createServerComponentClient({ cookies });
    
    const { data, error } = await supabase
      .from('recipe_additional_costs')
      .select('*')
      .eq('recipe_id', recipeId)
      .order('created_at', { ascending: true });
    
    if (error) {
      throw new Error(error.message);
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching additional costs:', error);
    return { success: false, error: 'Gagal mendapatkan data biaya tambahan' };
  }
}

// Fungsi untuk membuat biaya tambahan baru
export async function createAdditionalCost(cost: Omit<AdditionalCost, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const supabase = createServerComponentClient({ cookies });
    
    // Tambahkan timestamp updated_at
    const newCost = {
      ...cost,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('recipe_additional_costs')
      .insert(newCost)
      .select()
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    revalidatePath(`/dashboard/recipes/${cost.recipe_id}/hpp`);
    return { success: true, data };
  } catch (error) {
    console.error('Error creating additional cost:', error);
    return { success: false, error: 'Gagal menambahkan biaya tambahan' };
  }
}

// Fungsi untuk memperbarui biaya tambahan
export async function updateAdditionalCost(id: string, updates: Partial<AdditionalCost>) {
  try {
    const supabase = createServerComponentClient({ cookies });
    
    // Tambahkan timestamp updated_at
    const updatedCost = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('recipe_additional_costs')
      .update(updatedCost)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    revalidatePath(`/dashboard/recipes/${data.recipe_id}/hpp`);
    return { success: true, data };
  } catch (error) {
    console.error('Error updating additional cost:', error);
    return { success: false, error: 'Gagal memperbarui biaya tambahan' };
  }
}

// Fungsi untuk memperbarui faktor penyusutan resep
export async function updateRecipeWasteFactor(recipeId: string, wasteFactor: number) {
  try {
    const supabase = createServerComponentClient({ cookies });
    
    const { data, error } = await supabase
      .from('recipes')
      .update({
        waste_factor: wasteFactor,
        updated_at: new Date().toISOString()
      })
      .eq('id', recipeId)
      .select()
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    revalidatePath(`/dashboard/recipes/${recipeId}/hpp`);
    return { success: true, data };
  } catch (error) {
    console.error('Error updating recipe waste factor:', error);
    return { success: false, error: 'Gagal memperbarui faktor penyusutan' };
  }
}

// Fungsi untuk menghapus biaya tambahan
export async function deleteAdditionalCost(id: string) {
  try {
    const supabase = createServerComponentClient({ cookies });
    
    // Dapatkan recipe_id sebelum menghapus untuk revalidasi path
    const { data: costData } = await supabase
      .from('recipe_additional_costs')
      .select('recipe_id')
      .eq('id', id)
      .single();
    
    const { error } = await supabase
      .from('recipe_additional_costs')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw new Error(error.message);
    }
    
    if (costData?.recipe_id) {
      revalidatePath(`/dashboard/recipes/${costData.recipe_id}/hpp`);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting additional cost:', error);
    return { success: false, error: 'Gagal menghapus biaya tambahan' };
  }
}
