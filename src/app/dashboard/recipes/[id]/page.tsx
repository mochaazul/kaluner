import { getIngredients, getRecipeById } from "@/actions/recipes";
import { RecipeForm } from "@/components/recipes/recipe-form";
import { notFound } from "next/navigation";

interface RecipeEditPageProps {
  params: {
    id: string;
  };
}

export default async function RecipeEditPage({ params }: RecipeEditPageProps) {
  const { id } = params;
  
  // Ambil data resep dan bahan-bahannya
  const { success: recipeSuccess, data: recipe, error } = await getRecipeById(id);
  const { success: ingredientsSuccess, data: ingredients } = await getIngredients();

  if (!recipeSuccess || !recipe) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Resep</h1>
        <p className="text-gray-500 mt-1">
          Edit resep "{recipe.name}" dan perbarui biaya produksi (HPP)
        </p>
      </div>

      <RecipeForm 
        recipe={recipe} 
        ingredients={ingredientsSuccess ? ingredients : undefined} 
        isEditing 
      />
    </div>
  );
}
