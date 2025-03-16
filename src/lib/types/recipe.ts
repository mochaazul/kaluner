export type Ingredient = {
  id: string;
  name: string;
  category: string;
  unit: string;
  cost_per_unit: number;
  supplier_id?: string;
  min_stock_level?: number;
  is_seasonal?: boolean;
  created_at: string;
  updated_at?: string;
  business_id: string;
};

export type RecipeIngredient = {
  id: string;
  recipe_id: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  ingredient?: Ingredient;
  sub_recipe_id?: string;
  sub_recipe?: Recipe;
  created_at: string;
  updated_at: string;
};

export type Recipe = {
  id: string;
  name: string;
  category?: string;
  portion_size: number;
  portion_unit: string;
  preparation_time?: number;
  cooking_time?: number;
  instructions?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
  business_id: string;
};

export type RecipeWithIngredients = Recipe & {
  ingredients: (RecipeIngredient & {
    ingredient: Ingredient;
    sub_recipe?: Recipe;
  })[];
};
