'use server'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Ingredient, Recipe, RecipeIngredient, RecipeWithIngredients } from '@/lib/types/recipe'
import { revalidatePath } from 'next/cache'

// Fungsi untuk mengambil semua bahan
export async function getIngredients() {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    const { data: ingredients, error } = await supabase
      .from('ingredients')
      .select('*')
      .order('name')
    
    if (error) {
      throw new Error(error.message)
    }
    
    return { success: true, data: ingredients as Ingredient[] }
  } catch (error) {
    console.error('Error fetching ingredients:', error)
    return { success: false, error: 'Gagal mengambil data bahan' }
  }
}

// Fungsi untuk menambahkan bahan baru
export async function addIngredient(ingredient: Omit<Ingredient, 'id' | 'created_at' | 'updated_at' | 'business_id'>) {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    // Dapatkan business_id dari user yang sedang login
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      throw new Error('Anda harus login terlebih dahulu')
    }
    
    // Dapatkan business_id dari profil user
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('business_id')
      .eq('id', session.user.id)
      .single()
    
    if (profileError || !profile?.business_id) {
      throw new Error('Profil bisnis tidak ditemukan')
    }
    
    const { data, error } = await supabase
      .from('ingredients')
      .insert({
        ...ingredient,
        business_id: profile.business_id
      })
      .select()
    
    if (error) {
      throw new Error(error.message)
    }
    
    revalidatePath('/dashboard/recipes/ingredients')
    return { success: true, data: data[0] as Ingredient }
  } catch (error) {
    console.error('Error adding ingredient:', error)
    return { success: false, error: 'Gagal menambahkan bahan' }
  }
}

// Fungsi untuk mengupdate bahan
export async function updateIngredient(id: string, ingredient: Partial<Ingredient>) {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    const { data, error } = await supabase
      .from('ingredients')
      .update(ingredient)
      .eq('id', id)
      .select()
    
    if (error) {
      throw new Error(error.message)
    }
    
    revalidatePath('/dashboard/recipes/ingredients')
    return { success: true, data: data[0] as Ingredient }
  } catch (error) {
    console.error('Error updating ingredient:', error)
    return { success: false, error: 'Gagal mengupdate bahan' }
  }
}

// Fungsi untuk menghapus bahan
export async function deleteIngredient(id: string) {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    const { error } = await supabase
      .from('ingredients')
      .delete()
      .eq('id', id)
    
    if (error) {
      throw new Error(error.message)
    }
    
    revalidatePath('/dashboard/recipes/ingredients')
    return { success: true }
  } catch (error) {
    console.error('Error deleting ingredient:', error)
    return { success: false, error: 'Gagal menghapus bahan' }
  }
}

// Fungsi untuk mengambil semua resep
export async function getRecipes() {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    const { data: recipes, error } = await supabase
      .from('recipes')
      .select('*')
      .order('name')
    
    if (error) {
      throw new Error(error.message)
    }
    
    return { success: true, data: recipes as Recipe[] }
  } catch (error) {
    console.error('Error fetching recipes:', error)
    return { success: false, error: 'Gagal mengambil data resep' }
  }
}

// Fungsi untuk mengambil detail resep dengan bahan-bahannya
export async function getRecipeById(id: string) {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    // Ambil data resep
    const { data: recipe, error: recipeError } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single()
    
    if (recipeError) {
      throw new Error(recipeError.message)
    }
    
    // Ambil bahan-bahan resep
    const { data: recipeIngredients, error: ingredientsError } = await supabase
      .from('recipe_ingredients')
      .select(`
        *,
        ingredient:ingredients(*),
        sub_recipe:recipes(*)
      `)
      .eq('recipe_id', id)
    
    if (ingredientsError) {
      throw new Error(ingredientsError.message)
    }
    
    const recipeWithIngredients: RecipeWithIngredients = {
      ...recipe as Recipe,
      ingredients: recipeIngredients as any[]
    }
    
    return { success: true, data: recipeWithIngredients }
  } catch (error) {
    console.error('Error fetching recipe:', error)
    return { success: false, error: 'Gagal mengambil detail resep' }
  }
}

// Fungsi untuk menambahkan resep baru
export async function addRecipe(
  recipe: Omit<Recipe, 'id' | 'created_at' | 'updated_at' | 'business_id'>,
  ingredients: Omit<RecipeIngredient, 'id' | 'recipe_id' | 'created_at' | 'updated_at'>[]
) {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    // Dapatkan business_id dari user yang sedang login
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      throw new Error('Anda harus login terlebih dahulu')
    }
    
    // Dapatkan business_id dari profil user
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('business_id')
      .eq('id', session.user.id)
      .single()
    
    if (profileError || !profile?.business_id) {
      throw new Error('Profil bisnis tidak ditemukan')
    }
    
    // Mulai transaksi dengan memasukkan resep terlebih dahulu
    const { data: newRecipe, error: recipeError } = await supabase
      .from('recipes')
      .insert({
        ...recipe,
        business_id: profile.business_id
      })
      .select()
    
    if (recipeError || !newRecipe?.[0]) {
      throw new Error(recipeError?.message || 'Gagal menambahkan resep')
    }
    
    const recipeId = newRecipe[0].id
    
    // Kemudian masukkan bahan-bahan resep
    if (ingredients.length > 0) {
      const recipeIngredients = ingredients.map(ingredient => ({
        ...ingredient,
        recipe_id: recipeId
      }))
      
      const { error: ingredientsError } = await supabase
        .from('recipe_ingredients')
        .insert(recipeIngredients)
      
      if (ingredientsError) {
        // Jika gagal menambahkan bahan, hapus resep yang sudah dibuat
        await supabase.from('recipes').delete().eq('id', recipeId)
        throw new Error(ingredientsError.message)
      }
    }
    
    // Hitung ulang cost_per_serving
    await calculateRecipeCost(recipeId)
    
    revalidatePath('/dashboard/recipes')
    return { success: true, data: { ...newRecipe[0], id: recipeId } }
  } catch (error) {
    console.error('Error adding recipe:', error)
    return { success: false, error: 'Gagal menambahkan resep' }
  }
}

// Fungsi untuk mengupdate resep
export async function updateRecipe(
  id: string,
  recipe: Partial<Recipe>,
  ingredients?: Omit<RecipeIngredient, 'id' | 'recipe_id' | 'created_at' | 'updated_at'>[]
) {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    // Update data resep
    const { data: updatedRecipe, error: recipeError } = await supabase
      .from('recipes')
      .update(recipe)
      .eq('id', id)
      .select()
    
    if (recipeError) {
      throw new Error(recipeError.message)
    }
    
    // Jika ada perubahan pada bahan, hapus semua bahan lama dan tambahkan yang baru
    if (ingredients) {
      // Hapus bahan lama
      const { error: deleteError } = await supabase
        .from('recipe_ingredients')
        .delete()
        .eq('recipe_id', id)
      
      if (deleteError) {
        throw new Error(deleteError.message)
      }
      
      // Tambahkan bahan baru
      if (ingredients.length > 0) {
        const recipeIngredients = ingredients.map(ingredient => ({
          ...ingredient,
          recipe_id: id
        }))
        
        const { error: ingredientsError } = await supabase
          .from('recipe_ingredients')
          .insert(recipeIngredients)
        
        if (ingredientsError) {
          throw new Error(ingredientsError.message)
        }
      }
      
      // Hitung ulang cost_per_serving
      await calculateRecipeCost(id)
    }
    
    revalidatePath('/dashboard/recipes')
    revalidatePath(`/dashboard/recipes/${id}`)
    return { success: true, data: updatedRecipe?.[0] }
  } catch (error) {
    console.error('Error updating recipe:', error)
    return { success: false, error: 'Gagal mengupdate resep' }
  }
}

// Fungsi untuk menghapus resep
export async function deleteRecipe(id: string) {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    // Hapus bahan-bahan resep terlebih dahulu
    const { error: ingredientsError } = await supabase
      .from('recipe_ingredients')
      .delete()
      .eq('recipe_id', id)
    
    if (ingredientsError) {
      throw new Error(ingredientsError.message)
    }
    
    // Kemudian hapus resep
    const { error: recipeError } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id)
    
    if (recipeError) {
      throw new Error(recipeError.message)
    }
    
    revalidatePath('/dashboard/recipes')
    return { success: true }
  } catch (error) {
    console.error('Error deleting recipe:', error)
    return { success: false, error: 'Gagal menghapus resep' }
  }
}

// Fungsi untuk menghitung HPP resep
export async function calculateRecipeCost(recipeId: string) {
  try {
    const supabase = createServerComponentClient({ cookies });
    
    // Dapatkan resep
    const { data: recipe, error: recipeError } = await supabase
      .from('recipes')
      .select('id, name, portion_size, waste_factor')
      .eq('id', recipeId)
      .single();
    
    if (recipeError) {
      throw new Error(recipeError.message);
    }
    
    // Dapatkan bahan-bahan resep dengan data ingredient
    const { data: ingredients, error: ingredientsError } = await supabase
      .from('recipe_ingredients')
      .select(`
        id, 
        quantity, 
        ingredient_id, 
        sub_recipe_id,
        ingredients:ingredient_id (id, name, cost_per_unit, unit),
        sub_recipes:sub_recipe_id (id, name, cost_per_serving)
      `)
      .eq('recipe_id', recipeId);
    
    if (ingredientsError) {
      console.error("Error fetching ingredients:", ingredientsError);
      // Lanjutkan meskipun ada error
    }
    
    // Dapatkan biaya tambahan
    let additionalCosts = [];
    try {
      const { data: costs, error: costsError } = await supabase
        .from('recipe_additional_costs')
        .select('*')
        .eq('recipe_id', recipeId);
      
      if (!costsError && costs) {
        additionalCosts = costs;
      }
    } catch (error) {
      console.error("Error fetching additional costs:", error);
      // Lanjutkan meskipun ada error, karena tabel mungkin belum ada
    }
    
    // Hitung total biaya bahan
    let totalIngredientCost = 0;
    
    if (ingredients) {
      for (const item of ingredients) {
        if (item.ingredient_id && item.ingredients) {
          // Pastikan item.ingredients adalah objek tunggal, bukan array
          const ingredientCost = item.quantity * ((item.ingredients as any).cost_per_unit || 0);
          totalIngredientCost += ingredientCost;
        } else if (item.sub_recipe_id && item.sub_recipes) {
          // Pastikan item.sub_recipes adalah objek tunggal, bukan array
          const subRecipeCost = item.quantity * ((item.sub_recipes as any).cost_per_serving || 0);
          totalIngredientCost += subRecipeCost;
        }
      }
    }
    
    // Hitung total biaya tambahan
    const totalAdditionalCost = additionalCosts.reduce((sum, cost) => sum + (cost.amount || 0), 0);
    
    // Hitung total biaya dasar (bahan + tambahan)
    let totalBaseCost = totalIngredientCost + totalAdditionalCost;
    
    // Terapkan faktor penyusutan jika ada
    if (recipe.waste_factor && recipe.waste_factor > 0) {
      totalBaseCost = totalBaseCost / (1 - recipe.waste_factor);
    }
    
    // Hitung biaya per porsi
    const costPerServing = recipe.portion_size > 0 
      ? totalBaseCost / recipe.portion_size 
      : totalBaseCost;
    
    // Update cost_per_serving di database
    const { error: updateError } = await supabase
      .from('recipes')
      .update({ 
        cost_per_serving: costPerServing,
        updated_at: new Date().toISOString()
      })
      .eq('id', recipeId);
    
    if (updateError) {
      throw new Error(updateError.message);
    }
    
    return { 
      success: true, 
      data: { 
        totalIngredientCost,
        totalAdditionalCost,
        totalBaseCost,
        costPerServing,
        wasteFactor: recipe.waste_factor || 0
      } 
    };
  } catch (error) {
    console.error('Error calculating recipe cost:', error);
    return { success: false, error: 'Gagal menghitung biaya resep' };
  }
}

// Fungsi untuk menduplikasi resep
export async function duplicateRecipe(id: string, newName: string) {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    // Ambil data resep yang akan diduplikasi
    const { data: originalRecipe, error: recipeError } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (recipeError || !originalRecipe) {
      throw new Error(recipeError?.message || 'Resep tidak ditemukan')
    }
    
    // Ambil bahan-bahan resep
    const { data: originalIngredients, error: ingredientsError } = await supabase
      .from('recipe_ingredients')
      .select('*')
      .eq('recipe_id', id);
    
    if (ingredientsError) {
      throw new Error(ingredientsError.message)
    }
    
    // Buat resep baru dengan data dari resep asli
    const { id: originalId, created_at, updated_at, ...recipeData } = originalRecipe
    
    const { data: newRecipe, error: newRecipeError } = await supabase
      .from('recipes')
      .insert({
        ...recipeData,
        name: newName || `${originalRecipe.name} (Salinan)`,
      })
      .select()
    
    if (newRecipeError || !newRecipe?.[0]) {
      throw new Error(newRecipeError?.message || 'Gagal menduplikasi resep')
    }
    
    const newRecipeId = newRecipe[0].id
    
    // Duplikasi bahan-bahan resep
    if (originalIngredients && originalIngredients.length > 0) {
      const newIngredients = originalIngredients.map(({ id, recipe_id, created_at, updated_at, ...ingredientData }) => ({
        ...ingredientData,
        recipe_id: newRecipeId
      }))
      
      const { error: newIngredientsError } = await supabase
        .from('recipe_ingredients')
        .insert(newIngredients)
      
      if (newIngredientsError) {
        // Jika gagal menambahkan bahan, hapus resep yang sudah dibuat
        await supabase.from('recipes').delete().eq('id', newRecipeId)
        throw new Error(newIngredientsError.message)
      }
    }
    
    // Hitung ulang cost_per_serving
    await calculateRecipeCost(newRecipeId)
    
    revalidatePath('/dashboard/recipes')
    return { success: true, data: { ...newRecipe[0], id: newRecipeId } }
  } catch (error) {
    console.error('Error duplicating recipe:', error)
    return { success: false, error: 'Gagal menduplikasi resep' }
  }
}
