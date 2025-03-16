'use server'

import { deleteIngredient } from "@/actions/recipes";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const result = await deleteIngredient(id);

  if (result.success) {
    return NextResponse.redirect(new URL('/dashboard/recipes/ingredients', request.url));
  } else {
    return NextResponse.redirect(
      new URL(`/dashboard/recipes/ingredients?error=${encodeURIComponent(result.error || 'Gagal menghapus bahan')}`, request.url)
    );
  }
}
