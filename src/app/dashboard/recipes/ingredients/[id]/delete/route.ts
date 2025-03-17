'use server'

import { deleteIngredientAction } from "@/actions/route-actions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  await deleteIngredientAction(id);
  return NextResponse.redirect(new URL('/dashboard/recipes/ingredients', request.url));
}

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  await deleteIngredientAction(id);
  return NextResponse.redirect(new URL('/dashboard/recipes/ingredients', request.url));
}
