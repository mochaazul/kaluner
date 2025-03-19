import { z } from 'zod';

export const businessSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Nama bisnis harus minimal 2 karakter' })
    .max(100, { message: 'Nama bisnis tidak boleh lebih dari 100 karakter' }),
  description: z
    .string()
    .max(500, { message: 'Deskripsi tidak boleh lebih dari 500 karakter' })
    .nullable()
    .optional(),
  logo_url: z
    .string()
    .url({ message: 'URL logo tidak valid' })
    .nullable()
    .optional(),
  address: z
    .string()
    .max(200, { message: 'Alamat tidak boleh lebih dari 200 karakter' })
    .nullable()
    .optional(),
  phone: z
    .string()
    .regex(/^(\+62|62|0)[0-9]{9,12}$/, { message: 'Nomor telepon tidak valid' })
    .nullable()
    .optional(),
});

export type BusinessFormValues = z.infer<typeof businessSchema>;

export const ingredientSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Nama bahan harus minimal 2 karakter' })
    .max(100, { message: 'Nama bahan tidak boleh lebih dari 100 karakter' }),
  cost_per_unit: z
    .number()
    .min(0, { message: 'Harga per unit tidak boleh negatif' }),
  unit: z
    .string()
    .min(1, { message: 'Unit harus diisi' })
    .max(20, { message: 'Unit tidak boleh lebih dari 20 karakter' }),
  stock_quantity: z
    .number()
    .min(0, { message: 'Jumlah stok tidak boleh negatif' })
    .nullable()
    .optional(),
  min_stock_level: z
    .number()
    .min(0, { message: 'Level stok minimum tidak boleh negatif' })
    .nullable()
    .optional(),
  supplier_id: z
    .string()
    .nullable()
    .optional(),
});

export type IngredientFormValues = z.infer<typeof ingredientSchema>;

export const recipeSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Nama resep harus minimal 2 karakter' })
    .max(100, { message: 'Nama resep tidak boleh lebih dari 100 karakter' }),
  description: z
    .string()
    .max(1000, { message: 'Deskripsi tidak boleh lebih dari 1000 karakter' })
    .nullable()
    .optional(),
  category: z
    .string()
    .max(50, { message: 'Kategori tidak boleh lebih dari 50 karakter' })
    .nullable()
    .optional(),
  portion_size: z
    .number()
    .min(1, { message: 'Jumlah porsi harus minimal 1' }),
  portion_unit: z
    .string()
    .min(1, { message: 'Unit porsi harus diisi' })
    .max(20, { message: 'Unit porsi tidak boleh lebih dari 20 karakter' }),
  image_url: z
    .string()
    .url({ message: 'URL gambar tidak valid' })
    .nullable()
    .optional(),
});

export type RecipeFormValues = z.infer<typeof recipeSchema>;

export const recipeIngredientSchema = z.object({
  ingredient_id: z
    .string()
    .min(1, { message: 'Bahan harus dipilih' }),
  quantity: z
    .number()
    .min(0, { message: 'Jumlah tidak boleh negatif' }),
  unit: z
    .string()
    .min(1, { message: 'Unit harus diisi' }),
});

export type RecipeIngredientFormValues = z.infer<typeof recipeIngredientSchema>;

export const supplierSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Nama supplier harus minimal 2 karakter' })
    .max(100, { message: 'Nama supplier tidak boleh lebih dari 100 karakter' }),
  contact_person: z
    .string()
    .max(100, { message: 'Nama kontak tidak boleh lebih dari 100 karakter' })
    .nullable()
    .optional(),
  email: z
    .string()
    .email({ message: 'Email tidak valid' })
    .nullable()
    .optional(),
  phone: z
    .string()
    .regex(/^(\+62|62|0)[0-9]{9,12}$/, { message: 'Nomor telepon tidak valid' })
    .nullable()
    .optional(),
  address: z
    .string()
    .max(200, { message: 'Alamat tidak boleh lebih dari 200 karakter' })
    .nullable()
    .optional(),
});

export type SupplierFormValues = z.infer<typeof supplierSchema>;
