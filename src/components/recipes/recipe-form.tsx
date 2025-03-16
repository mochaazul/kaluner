'use client'

import { addRecipe, getIngredients, updateRecipe } from "@/actions/recipes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ingredient, Recipe, RecipeIngredient, RecipeWithIngredients } from "@/lib/types/recipe";
import { ArrowLeft, Loader2, Plus, Trash, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface RecipeFormProps {
  recipe?: RecipeWithIngredients;
  ingredients?: Ingredient[];
  isEditing?: boolean;
}

export function RecipeForm({ recipe, ingredients: initialIngredients, isEditing = false }: RecipeFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loadingIngredients, setLoadingIngredients] = useState(!initialIngredients);
  
  const [formData, setFormData] = useState({
    name: recipe?.name || '',
    description: recipe?.description || '',
    category: recipe?.category || '',
    yield_quantity: recipe?.yield_quantity?.toString() || '1',
    yield_unit: recipe?.yield_unit || 'porsi',
    instructions: recipe?.instructions || '',
    is_base_recipe: recipe?.is_base_recipe || false,
    is_public: recipe?.is_public || false,
    tags: recipe?.tags?.join(', ') || '',
  });

  const [recipeIngredients, setRecipeIngredients] = useState<{
    id?: string;
    ingredient_id: string;
    quantity: string;
    unit: string;
    sub_recipe_id?: string;
  }[]>(
    recipe?.ingredients?.map(item => ({
      id: item.id,
      ingredient_id: item.ingredient_id,
      quantity: item.quantity.toString(),
      unit: item.unit,
      sub_recipe_id: item.sub_recipe_id,
    })) || []
  );

  // Fetch ingredients if not provided
  useEffect(() => {
    if (initialIngredients) {
      setIngredients(initialIngredients);
      return;
    }

    const fetchIngredients = async () => {
      setLoadingIngredients(true);
      try {
        const result = await getIngredients();
        if (result.success) {
          setIngredients(result.data || []);
        } else {
          toast.error(result.error || 'Gagal mengambil data bahan');
        }
      } catch (error) {
        console.error('Error fetching ingredients:', error);
        toast.error('Terjadi kesalahan saat mengambil data bahan');
      } finally {
        setLoadingIngredients(false);
      }
    };

    fetchIngredients();
  }, [initialIngredients]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: target.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddIngredient = () => {
    setRecipeIngredients(prev => [
      ...prev,
      {
        ingredient_id: '',
        quantity: '0',
        unit: '',
      }
    ]);
  };

  const handleRemoveIngredient = (index: number) => {
    setRecipeIngredients(prev => prev.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index: number, field: string, value: string) => {
    setRecipeIngredients(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      
      // Jika ingredient_id berubah, update unit sesuai dengan unit bahan
      if (field === 'ingredient_id') {
        const selectedIngredient = ingredients.find(ing => ing.id === value);
        if (selectedIngredient) {
          updated[index].unit = selectedIngredient.unit;
        }
      }
      
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validasi data
      if (recipeIngredients.length === 0) {
        toast.error('Resep harus memiliki minimal satu bahan');
        setLoading(false);
        return;
      }

      // Format data
      const recipeData = {
        ...formData,
        yield_quantity: parseInt(formData.yield_quantity),
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
      };

      const ingredientsData = recipeIngredients.map(item => ({
        ingredient_id: item.ingredient_id,
        quantity: parseFloat(item.quantity),
        unit: item.unit,
        sub_recipe_id: item.sub_recipe_id || null,
      }));

      let result;
      
      if (isEditing && recipe) {
        result = await updateRecipe(recipe.id, recipeData, ingredientsData);
      } else {
        result = await addRecipe(recipeData as any, ingredientsData as any);
      }

      if (result.success) {
        toast.success(isEditing ? 'Resep berhasil diperbarui' : 'Resep berhasil ditambahkan');
        router.push('/dashboard/recipes');
        router.refresh();
      } else {
        toast.error(result.error || 'Terjadi kesalahan');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loadingIngredients) {
    return (
      <Card className="p-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
        <p className="mt-2">Memuat data bahan...</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Resep *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Masukkan nama resep"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategori *</Label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pilih Kategori</option>
              <option value="Makanan Utama">Makanan Utama</option>
              <option value="Makanan Pembuka">Makanan Pembuka</option>
              <option value="Makanan Penutup">Makanan Penutup</option>
              <option value="Minuman">Minuman</option>
              <option value="Camilan">Camilan</option>
              <option value="Saus">Saus</option>
              <option value="Bumbu">Bumbu</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="yield_quantity">Jumlah Hasil *</Label>
            <Input
              id="yield_quantity"
              name="yield_quantity"
              type="number"
              min="1"
              step="1"
              value={formData.yield_quantity}
              onChange={handleChange}
              required
              placeholder="Masukkan jumlah hasil"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="yield_unit">Satuan Hasil *</Label>
            <select
              id="yield_unit"
              name="yield_unit"
              value={formData.yield_unit}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="porsi">porsi</option>
              <option value="pcs">pcs</option>
              <option value="gelas">gelas</option>
              <option value="botol">botol</option>
              <option value="mangkok">mangkok</option>
              <option value="piring">piring</option>
              <option value="loyang">loyang</option>
              <option value="gram">gram</option>
              <option value="kilogram">kilogram</option>
              <option value="liter">liter</option>
              <option value="mililiter">mililiter</option>
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Deskripsi</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Deskripsi resep (opsional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="tags">Tag (pisahkan dengan koma)</Label>
            <Input
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Contoh: pedas, cepat saji, favorit"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_base_recipe"
              name="is_base_recipe"
              checked={formData.is_base_recipe}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <Label htmlFor="is_base_recipe">Resep Dasar</Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_public"
              name="is_public"
              checked={formData.is_public}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <Label htmlFor="is_public">Resep Publik</Label>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Bahan-bahan</h3>
            <Button
              type="button"
              onClick={handleAddIngredient}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              <span>Tambah Bahan</span>
            </Button>
          </div>

          {ingredients.length === 0 ? (
            <Card className="p-4 bg-yellow-50 border-yellow-200 text-yellow-700">
              <p>Belum ada bahan yang tersedia. <a href="/dashboard/recipes/ingredients/new" className="underline">Tambah bahan terlebih dahulu</a>.</p>
            </Card>
          ) : recipeIngredients.length === 0 ? (
            <Card className="p-4 bg-gray-50 border-gray-200 text-gray-700 text-center">
              <p>Belum ada bahan yang ditambahkan. Klik "Tambah Bahan" untuk menambahkan bahan.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {recipeIngredients.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 items-end border p-4 rounded-lg">
                  <div className="col-span-5">
                    <Label htmlFor={`ingredient_${index}`}>Bahan *</Label>
                    <select
                      id={`ingredient_${index}`}
                      value={item.ingredient_id}
                      onChange={(e) => handleIngredientChange(index, 'ingredient_id', e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Pilih Bahan</option>
                      {ingredients.map((ing) => (
                        <option key={ing.id} value={ing.id}>
                          {ing.name} ({ing.unit})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-3">
                    <Label htmlFor={`quantity_${index}`}>Jumlah *</Label>
                    <Input
                      id={`quantity_${index}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.quantity}
                      onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-span-3">
                    <Label htmlFor={`unit_${index}`}>Satuan *</Label>
                    <Input
                      id={`unit_${index}`}
                      value={item.unit}
                      onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                      required
                      disabled
                    />
                  </div>
                  <div className="col-span-1">
                    <Button
                      type="button"
                      onClick={() => handleRemoveIngredient(index)}
                      variant="outline"
                      size="sm"
                      className="h-10 w-10 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="instructions">Instruksi Pembuatan</Label>
          <textarea
            id="instructions"
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            rows={6}
            placeholder="Langkah-langkah pembuatan resep (opsional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="border-t pt-6">
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              <span>Kembali</span>
            </Button>
            <Button type="submit" disabled={loading} className="flex items-center gap-2">
              {loading && <Loader2 size={16} className="animate-spin" />}
              <span>{isEditing ? 'Perbarui Resep' : 'Tambah Resep'}</span>
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}
