'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { AdditionalCost } from "@/lib/types/recipe";
import { createAdditionalCost, deleteAdditionalCost, updateAdditionalCost, updateRecipeWasteFactor } from "@/actions/additional-costs";
import { calculateRecipeCost } from "@/actions/recipes";

interface AdditionalCostsFormProps {
  recipeId: string;
  additionalCosts?: AdditionalCost[];
  wasteFactor?: number | null;
}

export function AdditionalCostsForm({
  recipeId,
  additionalCosts = [],
  wasteFactor = 0
}: AdditionalCostsFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [costs, setCosts] = useState<(AdditionalCost & { isNew?: boolean })[]>(
    additionalCosts.length > 0 
      ? additionalCosts 
      : []
  );
  
  const [wasteFactorValue, setWasteFactorValue] = useState(wasteFactor || 0);

  // Menambahkan biaya tambahan baru (belum disimpan ke database)
  const handleAddCost = () => {
    setCosts([
      ...costs, 
      { 
        id: `temp-${Date.now()}`, 
        recipe_id: recipeId, 
        name: '', 
        amount: 0,
        isNew: true 
      }
    ]);
  };

  // Menghapus biaya tambahan
  const handleRemoveCost = async (index: number, id: string) => {
    const cost = costs[index];
    
    // Jika ini adalah item baru yang belum disimpan, cukup hapus dari state
    if (cost.isNew) {
      setCosts(costs.filter((_, i) => i !== index));
      return;
    }
    
    try {
      setIsSubmitting(true);
      const result = await deleteAdditionalCost(id);
      
      if (result.success) {
        setCosts(costs.filter((_, i) => i !== index));
        setMessage({ type: 'success', text: 'Biaya berhasil dihapus' });
        
        // Hitung ulang HPP
        await calculateRecipeCost(recipeId);
        router.refresh();
      } else {
        setMessage({ type: 'error', text: result.error || 'Gagal menghapus biaya' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan saat menghapus biaya' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mengubah nilai biaya tambahan
  const handleCostChange = (index: number, field: keyof AdditionalCost, value: string | number) => {
    const updatedCosts = [...costs];
    updatedCosts[index] = {
      ...updatedCosts[index],
      [field]: value
    };
    setCosts(updatedCosts);
  };

  // Menyimpan perubahan biaya tambahan
  const handleSaveCost = async (index: number) => {
    const cost = costs[index];
    
    if (!cost.name.trim()) {
      setMessage({ type: 'error', text: 'Nama biaya tidak boleh kosong' });
      return;
    }
    
    try {
      setIsSubmitting(true);
      setMessage(null);
      
      let result;
      
      // Jika ini adalah item baru, buat di database
      if (cost.isNew) {
        result = await createAdditionalCost({
          recipe_id: recipeId,
          name: cost.name,
          amount: typeof cost.amount === 'string' ? parseFloat(cost.amount) : cost.amount,
          notes: cost.notes
        });
        
        if (result.success && result.data) {
          // Update state dengan data dari database
          const updatedCosts = [...costs];
          updatedCosts[index] = {
            ...result.data,
            isNew: false
          };
          setCosts(updatedCosts);
        }
      } else {
        // Jika ini adalah item yang sudah ada, update di database
        result = await updateAdditionalCost(cost.id, {
          name: cost.name,
          amount: typeof cost.amount === 'string' ? parseFloat(cost.amount) : cost.amount,
          notes: cost.notes
        });
      }
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Biaya berhasil disimpan' });
        
        // Hitung ulang HPP
        await calculateRecipeCost(recipeId);
        router.refresh();
      } else {
        setMessage({ type: 'error', text: result.error || 'Gagal menyimpan biaya' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan saat menyimpan biaya' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Menyimpan perubahan faktor penyusutan
  const handleSaveWasteFactor = async () => {
    try {
      setIsSubmitting(true);
      setMessage(null);
      
      // Update waste factor di database
      const result = await updateRecipeWasteFactor(recipeId, wasteFactorValue);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Faktor penyusutan berhasil disimpan' });
        
        // Hitung ulang HPP
        await calculateRecipeCost(recipeId);
        router.refresh();
      } else {
        setMessage({ type: 'error', text: result.error || 'Gagal menyimpan faktor penyusutan' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan saat menyimpan faktor penyusutan' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {message && (
        <div className={`p-3 rounded-md ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.text}
        </div>
      )}
      
      <div className="space-y-4">
        {costs.map((cost, index) => (
          <Card key={cost.id} className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`cost-name-${index}`}>Nama Biaya</Label>
                <Input
                  id={`cost-name-${index}`}
                  value={cost.name}
                  onChange={(e) => handleCostChange(index, 'name', e.target.value)}
                  placeholder="Contoh: Tenaga Kerja, Listrik, dll"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`cost-amount-${index}`}>Jumlah (Rp)</Label>
                <Input
                  id={`cost-amount-${index}`}
                  type="number"
                  value={cost.amount}
                  onChange={(e) => handleCostChange(index, 'amount', e.target.value)}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`cost-notes-${index}`}>Catatan (Opsional)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id={`cost-notes-${index}`}
                    value={cost.notes || ''}
                    onChange={(e) => handleCostChange(index, 'notes', e.target.value)}
                    placeholder="Catatan tambahan..."
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveCost(index, cost.id)}
                    disabled={isSubmitting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button
                type="button"
                onClick={() => handleSaveCost(index)}
                disabled={isSubmitting}
              >
                Simpan
              </Button>
            </div>
          </Card>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={handleAddCost}
          disabled={isSubmitting}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Biaya Baru
        </Button>
      </div>
      
      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-medium">Faktor Penyusutan</h3>
        <p className="text-sm text-gray-500">
          Faktor penyusutan digunakan untuk memperhitungkan kehilangan bahan selama proses produksi.
          Nilai 0.1 berarti 10% dari total biaya akan ditambahkan sebagai faktor penyusutan.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="waste-factor">Faktor Penyusutan (0-0.5)</Label>
            <Input
              id="waste-factor"
              type="number"
              min="0"
              max="0.5"
              step="0.01"
              value={wasteFactorValue}
              onChange={(e) => setWasteFactorValue(parseFloat(e.target.value))}
            />
          </div>
          
          <div className="md:col-span-2 flex items-end">
            <Button
              type="button"
              onClick={handleSaveWasteFactor}
              disabled={isSubmitting}
            >
              Simpan Faktor Penyusutan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
