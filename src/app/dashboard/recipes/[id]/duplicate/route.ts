'use server'

import { duplicateRecipeAction } from "@/actions/route-actions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = (await context.params);
  await duplicateRecipeAction(id);
  return NextResponse.redirect(new URL('/dashboard/recipes', request.url));
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = (await context.params);
  await duplicateRecipeAction(id);
  return NextResponse.redirect(new URL('/dashboard/recipes', request.url));
}
