'use client'

import { addIngredient, updateIngredient } from "@/actions/recipes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ingredient } from "@/lib/types/recipe";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface IngredientFormProps {
  ingredient?: Ingredient;
  isEditing?: boolean;
}

export function IngredientForm({ ingredient, isEditing = false }: IngredientFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: ingredient?.name || '',
    description: ingredient?.description || '',
    category: ingredient?.category || '',
    unit: ingredient?.unit || '',
    price_per_unit: ingredient?.price_per_unit?.toString() || '',
    is_seasonal: ingredient?.is_seasonal || false,
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        price_per_unit: parseFloat(formData.price_per_unit),
      };

      let result;
      
      if (isEditing && ingredient) {
        result = await updateIngredient(ingredient.id, data);
      } else {
        result = await addIngredient(data as any);
      }

      if (result.success) {
        toast.success(isEditing ? 'Bahan berhasil diperbarui' : 'Bahan berhasil ditambahkan');
        router.push('/dashboard/recipes/ingredients');
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

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Bahan *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Masukkan nama bahan"
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
              <option value="Bahan Kering">Bahan Kering</option>
              <option value="Bahan Basah">Bahan Basah</option>
              <option value="Bumbu">Bumbu</option>
              <option value="Sayuran">Sayuran</option>
              <option value="Buah">Buah</option>
              <option value="Daging">Daging</option>
              <option value="Seafood">Seafood</option>
              <option value="Dairy">Dairy</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit">Satuan *</Label>
            <select
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pilih Satuan</option>
              <option value="gram">gram (g)</option>
              <option value="kilogram">kilogram (kg)</option>
              <option value="liter">liter (L)</option>
              <option value="mililiter">mililiter (mL)</option>
              <option value="sendok teh">sendok teh (sdt)</option>
              <option value="sendok makan">sendok makan (sdm)</option>
              <option value="buah">buah</option>
              <option value="butir">butir</option>
              <option value="potong">potong</option>
              <option value="lembar">lembar</option>
              <option value="bungkus">bungkus</option>
              <option value="sachet">sachet</option>
              <option value="botol">botol</option>
              <option value="kotak">kotak</option>
              <option value="kaleng">kaleng</option>
              <option value="ikat">ikat</option>
              <option value="siung">siung</option>
              <option value="ruas">ruas</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price_per_unit">Harga per Satuan (Rp) *</Label>
            <Input
              id="price_per_unit"
              name="price_per_unit"
              type="number"
              min="0"
              step="0.01"
              value={formData.price_per_unit}
              onChange={handleChange}
              required
              placeholder="Masukkan harga per satuan"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Deskripsi bahan (opsional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_seasonal"
              name="is_seasonal"
              checked={formData.is_seasonal}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <Label htmlFor="is_seasonal">Bahan Musiman</Label>
          </div>
        </div>

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
            <span>{isEditing ? 'Perbarui Bahan' : 'Tambah Bahan'}</span>
          </Button>
        </div>
      </form>
    </Card>
  );
}
