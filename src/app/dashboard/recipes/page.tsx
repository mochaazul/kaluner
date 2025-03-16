import { getRecipes } from "@/actions/recipes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calculator } from "lucide-react";
import { Recipe } from "@/lib/types/recipe";
import { Copy, Edit, Plus, Trash, Utensils } from "lucide-react";
import Link from "next/link";

export default async function RecipesPage() {
  const { success, data: recipes, error } = await getRecipes();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Resep</h1>
          <p className="text-gray-500 mt-1">
            Kelola resep dan hitung biaya produksi (HPP)
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/recipes/ingredients">
            <Button variant="outline" className="flex items-center gap-2">
              <Utensils size={16} />
              <span>Kelola Bahan</span>
            </Button>
          </Link>
          <Link href="/dashboard/recipes/new">
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              <span>Tambah Resep</span>
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <Card className="p-4 bg-red-50 border-red-200 text-red-700">
          {error}
        </Card>
      )}

      {!success ? (
        <div className="text-center p-8">Memuat data...</div>
      ) : recipes && recipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe: Recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-gray-500 mb-4">Belum ada resep yang ditambahkan</p>
          <Link href="/dashboard/recipes/new">
            <Button>Tambah Resep Pertama</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Card className="overflow-hidden">
      {recipe.image_url ? (
        <div className="h-40 overflow-hidden">
          <img 
            src={recipe.image_url} 
            alt={recipe.name} 
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="h-40 bg-gray-100 flex items-center justify-center">
          <Utensils size={48} className="text-gray-300" />
        </div>
      )}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{recipe.name}</h3>
            <p className="text-sm text-gray-500">{recipe.category}</p>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {recipe.portion_size} {recipe.portion_unit}
          </span>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-gray-500">Biaya per porsi:</p>
          <p className="text-lg font-semibold">
            Rp {recipe.cost_per_serving?.toLocaleString('id-ID') || '0'}
          </p>
        </div>
        
        <div className="mt-4 flex flex-col gap-2">
          <div className="flex justify-between">
            <Link href={`/dashboard/recipes/${recipe.id}`}>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Edit size={14} />
                <span>Edit</span>
              </Button>
            </Link>
            <Link href={`/dashboard/recipes/${recipe.id}/hpp`}>
              <Button variant="outline" size="sm" className="flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                <Calculator size={14} />
                <span>Lihat HPP</span>
              </Button>
            </Link>
          </div>
          <div className="flex justify-between">
            <form action={`/dashboard/recipes/${recipe.id}/duplicate`}>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Copy size={14} />
                <span>Duplikat</span>
              </Button>
            </form>
            <form action={`/dashboard/recipes/${recipe.id}/delete`}>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash size={14} />
                <span>Hapus</span>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Card>
  );
}
