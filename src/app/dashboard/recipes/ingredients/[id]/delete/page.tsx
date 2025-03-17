'use client'

import { deleteIngredientAction } from "@/actions/route-actions";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DeleteIngredientPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  useEffect(() => {
    const handleDelete = async () => {
      try {
        await deleteIngredientAction(id);
      } catch (error) {
        console.error("Error deleting ingredient:", error);
        router.push(`/dashboard/recipes/ingredients?error=${encodeURIComponent('Gagal menghapus bahan')}`);
      }
    };

    handleDelete();
  }, [id, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Menghapus Bahan</h1>
        <p className="mb-4">Sedang menghapus bahan...</p>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    </div>
  );
}
