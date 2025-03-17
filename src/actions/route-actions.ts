'use server'

import { deleteIngredient, deleteRecipe, duplicateRecipe } from "./recipes";
import { redirect } from "next/navigation";

export async function deleteRecipeAction(id: string) {
  const result = await deleteRecipe(id);
  
  if (result.success) {
    redirect('/dashboard/recipes');
  } else {
    redirect(`/dashboard/recipes?error=${encodeURIComponent(result.error || 'Gagal menghapus resep')}`);
  }
}

export async function duplicateRecipeAction(id: string) {
  const result = await duplicateRecipe(id, '');
  
  if (result.success) {
    redirect('/dashboard/recipes');
  } else {
    redirect(`/dashboard/recipes?error=${encodeURIComponent(result.error || 'Gagal menduplikasi resep')}`);
  }
}

export async function deleteIngredientAction(id: string) {
  const result = await deleteIngredient(id);
  
  if (result.success) {
    redirect('/dashboard/recipes/ingredients');
  } else {
    redirect(`/dashboard/recipes/ingredients?error=${encodeURIComponent(result.error || 'Gagal menghapus bahan')}`);
  }
}
