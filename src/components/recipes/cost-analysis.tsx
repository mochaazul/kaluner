'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecipeIngredient } from "@/lib/types/recipe";
import { BarChart, TrendingDown, AlertTriangle } from "lucide-react";

interface CostAnalysisProps {
  ingredients: RecipeIngredient[];
  totalIngredientCost: number;
  portionSize: number;
  portionUnit: string;
}

export function CostAnalysis({ 
  ingredients, 
  totalIngredientCost,
  portionSize,
  portionUnit
}: CostAnalysisProps) {
  // Identifikasi bahan dengan kontribusi biaya tertinggi (top 3)
  const highestCostIngredients = [...ingredients]
    .map(item => {
      let name = "Tidak diketahui";
      let cost = 0;
      
      if (item.ingredient) {
        name = item.ingredient.name;
        cost = item.quantity * (item.ingredient.cost_per_unit || 0);
      } else if (item.sub_recipe) {
        name = `Resep: ${item.sub_recipe.name}`;
        cost = item.quantity * (item.sub_recipe.cost_per_serving || 0);
      }
      
      const percentage = totalIngredientCost > 0 ? (cost / totalIngredientCost) * 100 : 0;
      
      return {
        id: item.id,
        name,
        cost,
        percentage,
        quantity: item.quantity,
        unit: item.unit
      };
    })
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 3);
  
  // Simulasi perubahan ukuran porsi
  const portionSizeOptions = [
    { size: portionSize * 0.8, label: `${Math.round(portionSize * 0.8)} ${portionUnit} (-20%)` },
    { size: portionSize * 0.9, label: `${Math.round(portionSize * 0.9)} ${portionUnit} (-10%)` },
    { size: portionSize, label: `${portionSize} ${portionUnit} (saat ini)` },
    { size: portionSize * 1.1, label: `${Math.round(portionSize * 1.1)} ${portionUnit} (+10%)` },
    { size: portionSize * 1.2, label: `${Math.round(portionSize * 1.2)} ${portionUnit} (+20%)` }
  ];
  
  // Hitung HPP per porsi untuk setiap opsi ukuran porsi
  const portionSizeAnalysis = portionSizeOptions.map(option => {
    const costPerServing = option.size > 0 ? totalIngredientCost / option.size : totalIngredientCost;
    return {
      ...option,
      costPerServing
    };
  });
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-blue-600" />
            <span>Analisis Biaya Bahan</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Bahan dengan Kontribusi Biaya Tertinggi
              </h3>
              {highestCostIngredients.length > 0 ? (
                <div className="space-y-3">
                  {highestCostIngredients.map(item => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} {item.unit} (Rp {item.cost.toLocaleString('id-ID')})
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">{item.percentage.toFixed(1)}%</p>
                        <p className="text-xs text-gray-500">dari total biaya</p>
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Potensi Optimasi</p>
                      <p className="text-sm text-amber-700">
                        Bahan-bahan di atas berkontribusi {highestCostIngredients.reduce((sum, item) => sum + item.percentage, 0).toFixed(1)}% dari total biaya. 
                        Pertimbangkan untuk mencari alternatif atau mengurangi jumlah bahan ini untuk mengoptimalkan HPP.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Tidak ada data bahan untuk dianalisis</p>
              )}
            </div>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Simulasi Perubahan Ukuran Porsi
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 text-left font-medium text-gray-500">Ukuran Porsi</th>
                      <th className="py-2 text-right font-medium text-gray-500">HPP per Porsi</th>
                      <th className="py-2 text-right font-medium text-gray-500">Perubahan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portionSizeAnalysis.map((option, index) => {
                      const isCurrentSize = option.size === portionSize;
                      const comparisonToDefault = isCurrentSize 
                        ? 0 
                        : ((option.costPerServing / portionSizeAnalysis[2].costPerServing) - 1) * 100;
                      
                      return (
                        <tr 
                          key={index} 
                          className={`border-b ${isCurrentSize ? 'bg-blue-50' : ''}`}
                        >
                          <td className="py-2 text-left">
                            {option.label}
                          </td>
                          <td className="py-2 text-right font-medium">
                            Rp {option.costPerServing.toLocaleString('id-ID')}
                          </td>
                          <td className="py-2 text-right">
                            {isCurrentSize ? (
                              <span className="text-gray-500">-</span>
                            ) : (
                              <span className={comparisonToDefault > 0 ? 'text-red-600' : 'text-green-600'}>
                                {comparisonToDefault > 0 ? '+' : ''}{comparisonToDefault.toFixed(1)}%
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-start gap-2">
                <TrendingDown className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Rekomendasi Ukuran Porsi</p>
                  <p className="text-sm text-blue-700">
                    Meningkatkan ukuran porsi dapat menurunkan HPP per porsi, tetapi perhatikan bahwa 
                    ini juga akan mempengaruhi harga jual dan persepsi nilai oleh pelanggan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
