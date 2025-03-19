import {
  businessSchema,
  ingredientSchema,
  recipeSchema,
  recipeIngredientSchema,
  supplierSchema
} from '@/validators/business';

describe('Business Validators', () => {
  describe('businessSchema', () => {
    it('should validate correct business data', () => {
      const validBusiness = {
        name: 'Warung Makan Enak',
        description: 'Warung makan sederhana dengan masakan rumahan',
        address: 'Jl. Contoh No. 123, Jakarta',
        phone: '081234567890'
      };

      const result = businessSchema.safeParse(validBusiness);
      expect(result.success).toBe(true);
    });

    it('should reject invalid business data', () => {
      const invalidBusiness = {
        name: 'A', // too short
        phone: 'bukan-nomor-telepon'
      };

      const result = businessSchema.safeParse(invalidBusiness);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        expect(errors.name).toBeDefined();
        expect(errors.phone).toBeDefined();
      }
    });
  });

  describe('ingredientSchema', () => {
    it('should validate correct ingredient data', () => {
      const validIngredient = {
        name: 'Tepung Terigu',
        cost_per_unit: 15000,
        unit: 'kg',
        stock_quantity: 5,
        min_stock_level: 2
      };

      const result = ingredientSchema.safeParse(validIngredient);
      expect(result.success).toBe(true);
    });

    it('should reject invalid ingredient data', () => {
      const invalidIngredient = {
        name: 'T', // too short
        cost_per_unit: -100, // negative price
        unit: ''
      };

      const result = ingredientSchema.safeParse(invalidIngredient);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        expect(errors.name).toBeDefined();
        expect(errors.cost_per_unit).toBeDefined();
        expect(errors.unit).toBeDefined();
      }
    });
  });

  describe('recipeSchema', () => {
    it('should validate correct recipe data', () => {
      const validRecipe = {
        name: 'Nasi Goreng Spesial',
        description: 'Nasi goreng dengan bumbu rahasia',
        category: 'Makanan Utama',
        portion_size: 1,
        portion_unit: 'porsi'
      };

      const result = recipeSchema.safeParse(validRecipe);
      expect(result.success).toBe(true);
    });

    it('should reject invalid recipe data', () => {
      const invalidRecipe = {
        name: 'N', // too short
        portion_size: 0, // too small
        portion_unit: ''
      };

      const result = recipeSchema.safeParse(invalidRecipe);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        expect(errors.name).toBeDefined();
        expect(errors.portion_size).toBeDefined();
        expect(errors.portion_unit).toBeDefined();
      }
    });
  });

  describe('recipeIngredientSchema', () => {
    it('should validate correct recipe ingredient data', () => {
      const validRecipeIngredient = {
        ingredient_id: '123e4567-e89b-12d3-a456-426614174000',
        quantity: 0.5,
        unit: 'kg'
      };

      const result = recipeIngredientSchema.safeParse(validRecipeIngredient);
      expect(result.success).toBe(true);
    });

    it('should reject invalid recipe ingredient data', () => {
      const invalidRecipeIngredient = {
        ingredient_id: '', // empty
        quantity: -1, // negative
        unit: ''
      };

      const result = recipeIngredientSchema.safeParse(invalidRecipeIngredient);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        expect(errors.ingredient_id).toBeDefined();
        expect(errors.quantity).toBeDefined();
        expect(errors.unit).toBeDefined();
      }
    });
  });

  describe('supplierSchema', () => {
    it('should validate correct supplier data', () => {
      const validSupplier = {
        name: 'PT Supplier Bahan Makanan',
        contact_person: 'John Doe',
        email: 'john@example.com',
        phone: '081234567890',
        address: 'Jl. Supplier No. 456, Jakarta'
      };

      const result = supplierSchema.safeParse(validSupplier);
      expect(result.success).toBe(true);
    });

    it('should reject invalid supplier data', () => {
      const invalidSupplier = {
        name: 'S', // too short
        email: 'bukan-email',
        phone: 'bukan-nomor-telepon'
      };

      const result = supplierSchema.safeParse(invalidSupplier);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        expect(errors.name).toBeDefined();
        expect(errors.email).toBeDefined();
        expect(errors.phone).toBeDefined();
      }
    });
  });
});
