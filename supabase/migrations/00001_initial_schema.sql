-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  tax_id TEXT,
  currency TEXT DEFAULT 'IDR',
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create ingredients table
CREATE TABLE IF NOT EXISTS ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  unit TEXT NOT NULL,
  cost_per_unit DECIMAL(10, 2) NOT NULL,
  stock_quantity DECIMAL(10, 2),
  min_stock_level DECIMAL(10, 2),
  supplier_id UUID,
  category TEXT,
  expiry_date DATE,
  storage_location TEXT,
  batch_number TEXT,
  last_updated TIMESTAMP WITH TIME ZONE
);

-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  payment_terms TEXT
);

-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  portion_size DECIMAL(10, 2) NOT NULL,
  portion_unit TEXT NOT NULL,
  preparation_time INTEGER,
  cooking_time INTEGER,
  instructions TEXT,
  notes TEXT,
  cost DECIMAL(10, 2),
  image_url TEXT
);

-- Create recipe_ingredients junction table
CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity DECIMAL(10, 2) NOT NULL,
  unit TEXT NOT NULL,
  preparation_method TEXT,
  notes TEXT,
  UNIQUE(recipe_id, ingredient_id)
);

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  selling_price DECIMAL(10, 2) NOT NULL,
  cost_price DECIMAL(10, 2),
  profit_margin DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT TRUE
);

-- Create promotions table
CREATE TABLE IF NOT EXISTS promotions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  discount_type TEXT NOT NULL, -- percentage, fixed_amount, bogo, etc.
  discount_value DECIMAL(10, 2) NOT NULL,
  min_purchase DECIMAL(10, 2),
  max_discount DECIMAL(10, 2),
  applicable_items JSONB -- Array of menu_item_ids or categories
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  notes TEXT
);

-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  total_amount DECIMAL(10, 2) NOT NULL,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  payment_method TEXT,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  notes TEXT
);

-- Create sale_items table
CREATE TABLE IF NOT EXISTS sale_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE RESTRICT,
  quantity DECIMAL(10, 2) NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) DEFAULT 0,
  subtotal DECIMAL(10, 2) NOT NULL
);

-- Create purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_status TEXT DEFAULT 'unpaid',
  payment_due DATE,
  notes TEXT
);

-- Create purchase_items table
CREATE TABLE IF NOT EXISTS purchase_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  purchase_id UUID NOT NULL REFERENCES purchases(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE RESTRICT,
  quantity DECIMAL(10, 2) NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL
);

-- Create business_settings table
CREATE TABLE IF NOT EXISTS business_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  setting_key TEXT NOT NULL,
  setting_value JSONB,
  UNIQUE(business_id, setting_key)
);

-- Enable Row Level Security on all tables
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for businesses
CREATE POLICY "Users can view their own businesses"
  ON businesses FOR SELECT
  USING (owner_id = auth.uid());

CREATE POLICY "Users can insert their own businesses"
  ON businesses FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their own businesses"
  ON businesses FOR UPDATE
  USING (owner_id = auth.uid());

CREATE POLICY "Users can delete their own businesses"
  ON businesses FOR DELETE
  USING (owner_id = auth.uid());

-- Create RLS policies for all other tables (business_id based)
-- Helper function to check if user owns a business
CREATE OR REPLACE FUNCTION auth.user_owns_business(business_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM businesses
    WHERE id = business_id AND owner_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ingredients policies
CREATE POLICY "Users can view ingredients in their businesses"
  ON ingredients FOR SELECT
  USING (auth.user_owns_business(business_id));

CREATE POLICY "Users can insert ingredients in their businesses"
  ON ingredients FOR INSERT
  WITH CHECK (auth.user_owns_business(business_id));

CREATE POLICY "Users can update ingredients in their businesses"
  ON ingredients FOR UPDATE
  USING (auth.user_owns_business(business_id));

CREATE POLICY "Users can delete ingredients in their businesses"
  ON ingredients FOR DELETE
  USING (auth.user_owns_business(business_id));

-- Suppliers policies
CREATE POLICY "Users can view suppliers in their businesses"
  ON suppliers FOR SELECT
  USING (auth.user_owns_business(business_id));

CREATE POLICY "Users can insert suppliers in their businesses"
  ON suppliers FOR INSERT
  WITH CHECK (auth.user_owns_business(business_id));

CREATE POLICY "Users can update suppliers in their businesses"
  ON suppliers FOR UPDATE
  USING (auth.user_owns_business(business_id));

CREATE POLICY "Users can delete suppliers in their businesses"
  ON suppliers FOR DELETE
  USING (auth.user_owns_business(business_id));

-- Recipes policies
CREATE POLICY "Users can view recipes in their businesses"
  ON recipes FOR SELECT
  USING (auth.user_owns_business(business_id));

CREATE POLICY "Users can insert recipes in their businesses"
  ON recipes FOR INSERT
  WITH CHECK (auth.user_owns_business(business_id));

CREATE POLICY "Users can update recipes in their businesses"
  ON recipes FOR UPDATE
  USING (auth.user_owns_business(business_id));

CREATE POLICY "Users can delete recipes in their businesses"
  ON recipes FOR DELETE
  USING (auth.user_owns_business(business_id));

-- Recipe ingredients policies
CREATE POLICY "Users can view recipe ingredients in their businesses"
  ON recipe_ingredients FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM recipes
    WHERE recipes.id = recipe_ingredients.recipe_id
    AND auth.user_owns_business(recipes.business_id)
  ));

CREATE POLICY "Users can insert recipe ingredients in their businesses"
  ON recipe_ingredients FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM recipes
    WHERE recipes.id = recipe_ingredients.recipe_id
    AND auth.user_owns_business(recipes.business_id)
  ));

CREATE POLICY "Users can update recipe ingredients in their businesses"
  ON recipe_ingredients FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM recipes
    WHERE recipes.id = recipe_ingredients.recipe_id
    AND auth.user_owns_business(recipes.business_id)
  ));

CREATE POLICY "Users can delete recipe ingredients in their businesses"
  ON recipe_ingredients FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM recipes
    WHERE recipes.id = recipe_ingredients.recipe_id
    AND auth.user_owns_business(recipes.business_id)
  ));

-- Menu items policies
CREATE POLICY "Users can view menu items in their businesses"
  ON menu_items FOR SELECT
  USING (auth.user_owns_business(business_id));

CREATE POLICY "Users can insert menu items in their businesses"
  ON menu_items FOR INSERT
  WITH CHECK (auth.user_owns_business(business_id));

CREATE POLICY "Users can update menu items in their businesses"
  ON menu_items FOR UPDATE
  USING (auth.user_owns_business(business_id));

CREATE POLICY "Users can delete menu items in their businesses"
  ON menu_items FOR DELETE
  USING (auth.user_owns_business(business_id));

-- Similar policies for other tables...
-- (Promotions, Customers, Sales, Sale Items, Purchases, Purchase Items, Business Settings)

-- Create functions and triggers for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables
CREATE TRIGGER update_businesses_updated_at
BEFORE UPDATE ON businesses
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_ingredients_updated_at
BEFORE UPDATE ON ingredients
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_suppliers_updated_at
BEFORE UPDATE ON suppliers
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_recipes_updated_at
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_recipe_ingredients_updated_at
BEFORE UPDATE ON recipe_ingredients
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_menu_items_updated_at
BEFORE UPDATE ON menu_items
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_promotions_updated_at
BEFORE UPDATE ON promotions
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_customers_updated_at
BEFORE UPDATE ON customers
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_sales_updated_at
BEFORE UPDATE ON sales
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_sale_items_updated_at
BEFORE UPDATE ON sale_items
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_purchases_updated_at
BEFORE UPDATE ON purchases
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_purchase_items_updated_at
BEFORE UPDATE ON purchase_items
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_business_settings_updated_at
BEFORE UPDATE ON business_settings
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
