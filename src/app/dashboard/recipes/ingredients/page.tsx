import { getIngredients } from "@/actions/recipes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Ingredient } from "@/lib/types/recipe";
import { Edit, Plus, Trash } from "lucide-react";
import Link from "next/link";

export default async function IngredientsPage() {
  const { success, data: ingredients, error } = await getIngredients();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Bahan</h1>
          <p className="text-gray-500 mt-1">
            Kelola bahan-bahan yang digunakan dalam resep Anda
          </p>
        </div>
        <Link href="/dashboard/recipes/ingredients/new">
          <Button className="flex items-center gap-2">
            <Plus size={16} />
            <span>Tambah Bahan</span>
          </Button>
        </Link>
      </div>

      {error && (
        <Card className="p-4 bg-red-50 border-red-200 text-red-700">
          {error}
        </Card>
      )}

      {!success ? (
        <div className="text-center p-8">Memuat data...</div>
      ) : ingredients && ingredients.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Bahan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Satuan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Harga per Satuan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Musiman
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {ingredients.map((ingredient: Ingredient) => (
                  <tr key={ingredient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {ingredient.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ingredient.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ingredient.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Rp {ingredient.cost_per_unit?.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ingredient.is_seasonal ? "Ya" : "Tidak"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link href={`/dashboard/recipes/ingredients/${ingredient.id}`}>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                            <Edit size={14} />
                          </Button>
                        </Link>
                        <form action={`/dashboard/recipes/ingredients/${ingredient.id}/delete`}>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash size={14} />
                          </Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-gray-500 mb-4">Belum ada bahan yang ditambahkan</p>
          <Link href="/dashboard/recipes/ingredients/new">
            <Button>Tambah Bahan Pertama</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
