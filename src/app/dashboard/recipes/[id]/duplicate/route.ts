'use server'

import { duplicateRecipe } from "@/actions/recipes";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const result = await duplicateRecipe(id, '');

  if (result.success) {
    return NextResponse.redirect(new URL('/dashboard/recipes', request.url));
  } else {
    return NextResponse.redirect(
      new URL(`/dashboard/recipes?error=${encodeURIComponent(result.error || 'Gagal menduplikasi resep')}`, request.url)
    );
  }
}
