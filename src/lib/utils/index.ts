import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names with Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as currency
 */
export function formatCurrency(amount: number): string {
  // Bulatkan ke bilangan bulat terdekat
  const roundedAmount = Math.round(amount);
  
  // Format dengan Intl.NumberFormat untuk mendapatkan pemisah ribuan yang benar
  const formatted = new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(roundedAmount);
  
  // Tambahkan 'Rp ' di depan dengan spasi
  return `Rp ${formatted}`;
}

/**
 * Formats a date as a localized string
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Calculates the cost of a recipe based on its ingredients
 */
export function calculateRecipeCost(ingredients: { quantity: number; cost_per_unit: number }[]): number {
  return ingredients.reduce((total, ingredient) => {
    return total + (ingredient.quantity * ingredient.cost_per_unit);
  }, 0);
}
