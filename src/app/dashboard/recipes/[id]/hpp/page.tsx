import { notFound } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart } from "@/components/recipes/pie-chart";
import { CostBreakdownTable } from "@/components/recipes/cost-breakdown-table";
import { AdditionalCostsForm } from "@/components/recipes/additional-costs-form";
import { getRecipeById, calculateRecipeCost } from "@/actions/recipes";
import { getAdditionalCostsByRecipeId } from "@/actions/additional-costs";
import { RecipeIngredient } from "@/lib/types/recipe";
import { CostAnalysis } from "@/components/recipes/cost-analysis";
import { updateRecipe } from "@/actions/recipes";

export default async function RecipeHPPPage({ params }: { params: { id: string } }) {
  const id = params.id;
  
  const { success, data: recipe, error } = await getRecipeById(id);
  
  if (!success || !recipe) {
    return notFound();
  }
  
  // Ambil biaya tambahan untuk resep ini
  let additionalCosts = [];
  try {
    const { data } = await getAdditionalCostsByRecipeId(id);
    if (data) {
      additionalCosts = data;
    }
  } catch (error) {
    console.error("Error fetching additional costs:", error);
    // Lanjutkan meskipun ada error, karena tabel mungkin belum ada
  }
  
  // Hitung HPP
  let costData = null;
  try {
    const result = await calculateRecipeCost(id);
    if (result.success && result.data) {
      costData = result.data;
    }
  } catch (error) {
    console.error("Error calculating recipe cost:", error);
    // Lanjutkan meskipun ada error
  }
  
  // Filter bahan-bahan yang valid (memiliki data ingredient atau sub_recipe)
  const validIngredients = (recipe.ingredients || []).filter(
    (ing) => ing.ingredient || ing.sub_recipe
  );

  // Siapkan data untuk pie chart
  const pieChartData = [];
  
  // Tambahkan data bahan-bahan
  if (costData && costData.totalIngredientCost > 0) {
    pieChartData.push({
      name: 'Bahan-bahan',
      value: costData.totalIngredientCost,
      percentage: (costData.totalIngredientCost / costData.totalBaseCost) * 100
    });
  }
  
  // Tambahkan data biaya tambahan
  if (additionalCosts && additionalCosts.length > 0) {
    additionalCosts.forEach(cost => {
      if (cost.amount > 0) {
        pieChartData.push({
          name: cost.name,
          value: cost.amount,
          percentage: (cost.amount / (costData?.totalBaseCost || 1)) * 100
        });
      }
    });
  }
  
  // Tambahkan data penyusutan jika ada
  if (costData && recipe.waste_factor && recipe.waste_factor > 0) {
    const wasteAmount = costData.totalBaseCost * recipe.waste_factor / (1 - recipe.waste_factor);
    pieChartData.push({
      name: 'Penyusutan',
      value: wasteAmount,
      percentage: (wasteAmount / costData.totalBaseCost) * 100
    });
  }
  
  // Hitung total biaya bahan
  let totalIngredientCost = 0;
  
  for (const item of validIngredients) {
    if (item.ingredient) {
      const ingredientCost = item.quantity * (item.ingredient.cost_per_unit || 0);
      totalIngredientCost += ingredientCost;
    } else if (item.sub_recipe) {
      const subRecipeCost = item.quantity * (item.sub_recipe.cost_per_serving || 0);
      totalIngredientCost += subRecipeCost;
    }
  }
  
  // Hitung total biaya tambahan
  const totalAdditionalCost = additionalCosts?.reduce((sum, cost) => sum + (cost.amount || 0), 0) || 0;
  
  // Hitung total biaya dasar (bahan + tambahan)
  let totalBaseCost = totalIngredientCost + totalAdditionalCost;
  
  // Terapkan faktor penyusutan jika ada
  let wasteAmount = 0;
  if (recipe.waste_factor && recipe.waste_factor > 0) {
    wasteAmount = totalBaseCost * recipe.waste_factor / (1 - recipe.waste_factor);
    totalBaseCost = totalBaseCost / (1 - recipe.waste_factor);
  }
  
  // Hitung biaya per porsi
  const costPerServing = recipe.portion_size > 0 
    ? totalBaseCost / recipe.portion_size 
    : totalBaseCost;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/recipes/${id}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Perhitungan HPP</h1>
          <p className="text-gray-500">{recipe.name}</p>
        </div>
      </div>

      {error && (
        <Card className="p-4 bg-red-50 border-red-200 text-red-700">
          {error}
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Biaya</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Total Biaya Bahan:</p>
                <p className="text-2xl font-bold">
                  Rp {totalIngredientCost.toLocaleString('id-ID')}
                </p>
              </div>
              
              {totalAdditionalCost > 0 && (
                <div>
                  <p className="text-sm text-gray-500">Biaya Tambahan:</p>
                  <p className="text-2xl font-bold">
                    Rp {totalAdditionalCost.toLocaleString('id-ID')}
                  </p>
                </div>
              )}
              
              {wasteAmount > 0 && (
                <div>
                  <p className="text-sm text-gray-500">Faktor Penyusutan:</p>
                  <p className="text-2xl font-bold">
                    Rp {wasteAmount.toLocaleString('id-ID')}
                  </p>
                </div>
              )}
              
              <div>
                <p className="text-sm text-gray-500">Total Biaya (dengan biaya tambahan):</p>
                <p className="text-xl font-bold">
                  Rp {totalBaseCost.toLocaleString('id-ID')}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Jumlah Porsi:</p>
                <p className="text-xl">
                  {recipe.portion_size} {recipe.portion_unit}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Biaya Per Porsi (HPP):</p>
                <p className="text-2xl font-bold text-blue-600">
                  Rp {costPerServing.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Proporsi Biaya</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {pieChartData.length > 0 ? (
              <PieChart data={pieChartData} />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Tidak ada data bahan untuk ditampilkan
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Biaya Tambahan</CardTitle>
        </CardHeader>
        <CardContent>
          <AdditionalCostsForm 
            recipeId={id} 
            additionalCosts={additionalCosts}
            wasteFactor={recipe.waste_factor}
          />
        </CardContent>
      </Card>

      <CostAnalysis 
        ingredients={validIngredients}
        totalIngredientCost={totalIngredientCost}
        portionSize={recipe.portion_size}
        portionUnit={recipe.portion_unit}
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Breakdown Biaya Bahan</CardTitle>
          <form action={async () => {
            'use server';
            await calculateRecipeCost(id);
          }}>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <RefreshCw size={14} />
              <span>Perbarui HPP</span>
            </Button>
          </form>
        </CardHeader>
        <CardContent>
          <CostBreakdownTable ingredients={validIngredients} totalCost={totalIngredientCost} />
        </CardContent>
      </Card>
    </div>
  );
}
