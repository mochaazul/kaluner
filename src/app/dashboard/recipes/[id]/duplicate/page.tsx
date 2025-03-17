'use client'

import { duplicateRecipeAction } from "@/actions/route-actions";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DuplicateRecipePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  useEffect(() => {
    const handleDuplicate = async () => {
      try {
        await duplicateRecipeAction(id);
      } catch (error) {
        console.error("Error duplicating recipe:", error);
        router.push(`/dashboard/recipes?error=${encodeURIComponent('Gagal menduplikasi resep')}`);
      }
    };

    handleDuplicate();
  }, [id, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Menduplikasi Resep</h1>
        <p className="mb-4">Sedang menduplikasi resep...</p>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    </div>
  );
}
