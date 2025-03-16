'use client';

import { RecipeIngredient } from "@/lib/types/recipe";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";

interface CostBreakdownTableProps {
  ingredients: RecipeIngredient[];
  totalCost: number;
}

type SortField = 'name' | 'quantity' | 'cost' | 'percentage';
type SortDirection = 'asc' | 'desc';

export function CostBreakdownTable({ ingredients, totalCost }: CostBreakdownTableProps) {
  const [sortField, setSortField] = useState<SortField>('percentage');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Hitung biaya dan persentase untuk setiap bahan
  const ingredientsWithCost = ingredients.map(item => {
    let name = "Tidak diketahui";
    let cost = 0;
    let unit = item.unit;
    
    if (item.ingredient) {
      name = item.ingredient.name;
      cost = item.quantity * (item.ingredient.cost_per_unit || 0);
    } else if (item.sub_recipe) {
      name = `Resep: ${item.sub_recipe.name}`;
      cost = item.quantity * (item.sub_recipe.cost_per_serving || 0);
    }
    
    const percentage = totalCost > 0 ? (cost / totalCost) * 100 : 0;
    
    return {
      ...item,
      displayName: name,
      cost,
      percentage
    };
  });

  // Urutkan bahan berdasarkan field dan arah yang dipilih
  const sortedIngredients = [...ingredientsWithCost].sort((a, b) => {
    if (sortField === 'name') {
      return sortDirection === 'asc' 
        ? a.displayName.localeCompare(b.displayName)
        : b.displayName.localeCompare(a.displayName);
    } else if (sortField === 'quantity') {
      return sortDirection === 'asc' 
        ? a.quantity - b.quantity
        : b.quantity - a.quantity;
    } else if (sortField === 'cost') {
      return sortDirection === 'asc' 
        ? a.cost - b.cost
        : b.cost - a.cost;
    } else {
      return sortDirection === 'asc' 
        ? a.percentage - b.percentage
        : b.percentage - a.percentage;
    }
  });

  // Render ikon sort
  const renderSortIcon = (field: SortField) => {
    if (field !== sortField) {
      return <ArrowUpDown size={14} />;
    }
    return sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Button 
              variant="ghost" 
              onClick={() => handleSort('name')}
              className="flex items-center gap-1 p-0 h-auto font-medium"
            >
              Nama Bahan {renderSortIcon('name')}
            </Button>
          </TableHead>
          <TableHead>
            <Button 
              variant="ghost" 
              onClick={() => handleSort('quantity')}
              className="flex items-center gap-1 p-0 h-auto font-medium"
            >
              Jumlah {renderSortIcon('quantity')}
            </Button>
          </TableHead>
          <TableHead>
            <Button 
              variant="ghost" 
              onClick={() => handleSort('cost')}
              className="flex items-center gap-1 p-0 h-auto font-medium"
            >
              Biaya {renderSortIcon('cost')}
            </Button>
          </TableHead>
          <TableHead>
            <Button 
              variant="ghost" 
              onClick={() => handleSort('percentage')}
              className="flex items-center gap-1 p-0 h-auto font-medium"
            >
              Persentase {renderSortIcon('percentage')}
            </Button>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedIngredients.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.displayName}</TableCell>
            <TableCell>
              {item.quantity} {item.unit}
            </TableCell>
            <TableCell>
              Rp {item.cost.toLocaleString('id-ID')}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <div className="w-full max-w-[100px] bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${Math.min(100, item.percentage)}%` }}
                  ></div>
                </div>
                <span>{item.percentage.toFixed(1)}%</span>
              </div>
            </TableCell>
          </TableRow>
        ))}
        <TableRow className="font-bold">
          <TableCell>Total</TableCell>
          <TableCell></TableCell>
          <TableCell>Rp {totalCost.toLocaleString('id-ID')}</TableCell>
          <TableCell>100%</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
