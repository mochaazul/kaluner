import { getIngredients, getRecipeById } from "@/actions/recipes";
import { RecipeForm } from "@/components/recipes/recipe-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BarChart3, Calculator } from "lucide-react";
import Link from "next/link";
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Edit Resep</h1>
          <p className="text-gray-500 mt-1">
            Edit resep "{recipe.name}" dan perbarui biaya produksi (HPP)
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/recipes/${id}/hpp`}>
            <Button variant="outline" className="flex items-center gap-2">
              <Calculator size={16} />
              <span>Lihat HPP</span>
            </Button>
          </Link>
        </div>
      </div>

      {recipe.cost_per_serving && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3">
            <BarChart3 className="text-blue-600" size={24} />
            <div>
              <p className="font-medium">HPP per Porsi:</p>
              <p className="text-xl font-bold text-blue-600">
                Rp {recipe.cost_per_serving.toLocaleString('id-ID')}
              </p>
            </div>
            <div className="ml-auto">
              <Link href={`/dashboard/recipes/${id}/hpp`}>
                <Button variant="link" size="sm" className="text-blue-600">
                  Lihat Detail
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      <RecipeForm 
        recipe={recipe} 
        ingredients={ingredientsSuccess ? ingredients : undefined} 
        isEditing 
      />
    </div>
  );
}
