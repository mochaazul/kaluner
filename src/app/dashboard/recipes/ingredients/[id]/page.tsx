import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { IngredientForm } from "@/components/recipes/ingredient-form";
import { Ingredient } from "@/lib/types/recipe";

interface IngredientEditPageProps {
  params: {
    id: string;
  };
}

export default async function IngredientEditPage({ params }: IngredientEditPageProps) {
  const { id } = params;
  const supabase = createServerComponentClient({ cookies });

  const { data: ingredient, error } = await supabase
    .from("ingredients")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !ingredient) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Bahan</h1>
        <p className="text-gray-500 mt-1">
          Edit informasi bahan "{ingredient.name}"
        </p>
      </div>

      <IngredientForm ingredient={ingredient as Ingredient} isEditing />
    </div>
  );
}
