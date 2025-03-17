'use client'

import { deleteRecipeAction } from "@/actions/route-actions";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DeleteRecipePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  useEffect(() => {
    const handleDelete = async () => {
      try {
        await deleteRecipeAction(id);
      } catch (error) {
        console.error("Error deleting recipe:", error);
        router.push(`/dashboard/recipes?error=${encodeURIComponent('Gagal menghapus resep')}`);
      }
    };

    handleDelete();
  }, [id, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Menghapus Resep</h1>
        <p className="mb-4">Sedang menghapus resep...</p>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    </div>
  );
}
