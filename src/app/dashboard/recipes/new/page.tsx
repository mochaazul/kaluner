import { getIngredients } from "@/actions/recipes";
import { RecipeForm } from "@/components/recipes/recipe-form";

export default async function NewRecipePage() {
  const { success, data: ingredients } = await getIngredients();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tambah Resep Baru</h1>
        <p className="text-gray-500 mt-1">
          Buat resep baru dan hitung biaya produksi (HPP)
        </p>
      </div>

      <RecipeForm ingredients={success ? ingredients : undefined} />
    </div>
  );
}
