import { IngredientForm } from "@/components/recipes/ingredient-form";

export default function NewIngredientPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tambah Bahan Baru</h1>
        <p className="text-gray-500 mt-1">
          Tambahkan bahan baru untuk digunakan dalam resep
        </p>
      </div>

      <IngredientForm />
    </div>
  );
}
