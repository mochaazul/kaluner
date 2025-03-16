-- Profiles table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Public profiles are viewable by everyone." 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile." 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Businesses table
CREATE TABLE public.businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES public.profiles(id) NOT NULL,
  business_name TEXT NOT NULL,
  business_type TEXT,
  address TEXT,
  phone TEXT,
  tax_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- Create policies for businesses
CREATE POLICY "Businesses are viewable by owner." 
  ON public.businesses FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert their own business." 
  ON public.businesses FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update their own business." 
  ON public.businesses FOR UPDATE USING (auth.uid() = profile_id);

-- Suppliers table
CREATE TABLE public.suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES public.businesses(id) NOT NULL,
  name TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  payment_terms TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

-- Create policies for suppliers
CREATE POLICY "Suppliers are viewable by business owner." 
  ON public.suppliers FOR SELECT USING (
    auth.uid() IN (
      SELECT profile_id FROM public.businesses WHERE id = business_id
    )
  );

CREATE POLICY "Business owners can insert suppliers." 
  ON public.suppliers FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT profile_id FROM public.businesses WHERE id = business_id
    )
  );

CREATE POLICY "Business owners can update suppliers." 
  ON public.suppliers FOR UPDATE USING (
    auth.uid() IN (
      SELECT profile_id FROM public.businesses WHERE id = business_id
    )
  );

CREATE POLICY "Business owners can delete suppliers." 
  ON public.suppliers FOR DELETE USING (
    auth.uid() IN (
      SELECT profile_id FROM public.businesses WHERE id = business_id
    )
  );

-- Ingredients table
CREATE TABLE public.ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES public.businesses(id) NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  unit TEXT NOT NULL,
  cost_per_unit DECIMAL(10, 2) NOT NULL,
  supplier_id UUID REFERENCES public.suppliers(id),
  min_stock_level DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.ingredients ENABLE ROW LEVEL SECURITY;

-- Create policies for ingredients
CREATE POLICY "Ingredients are viewable by business owner." 
  ON public.ingredients FOR SELECT USING (
    auth.uid() IN (
      SELECT profile_id FROM public.businesses WHERE id = business_id
    )
  );

CREATE POLICY "Business owners can insert ingredients." 
  ON public.ingredients FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT profile_id FROM public.businesses WHERE id = business_id
    )
  );

CREATE POLICY "Business owners can update ingredients." 
  ON public.ingredients FOR UPDATE USING (
    auth.uid() IN (
      SELECT profile_id FROM public.businesses WHERE id = business_id
    )
  );

CREATE POLICY "Business owners can delete ingredients." 
  ON public.ingredients FOR DELETE USING (
    auth.uid() IN (
      SELECT profile_id FROM public.businesses WHERE id = business_id
    )
  );

-- Inventory table
CREATE TABLE public.inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ingredient_id UUID REFERENCES public.ingredients(id) NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  expiry_date DATE,
  location TEXT,
  batch_number TEXT,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- Create policies for inventory
CREATE POLICY "Inventory is viewable by business owner." 
  ON public.inventory FOR SELECT USING (
    auth.uid() IN (
      SELECT b.profile_id 
      FROM public.businesses b 
      JOIN public.ingredients i ON b.id = i.business_id 
      WHERE i.id = ingredient_id
    )
  );

CREATE POLICY "Business owners can insert inventory." 
  ON public.inventory FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT b.profile_id 
      FROM public.businesses b 
      JOIN public.ingredients i ON b.id = i.business_id 
      WHERE i.id = ingredient_id
    )
  );

CREATE POLICY "Business owners can update inventory." 
  ON public.inventory FOR UPDATE USING (
    auth.uid() IN (
      SELECT b.profile_id 
      FROM public.businesses b 
      JOIN public.ingredients i ON b.id = i.business_id 
      WHERE i.id = ingredient_id
    )
  );

CREATE POLICY "Business owners can delete inventory." 
  ON public.inventory FOR DELETE USING (
    auth.uid() IN (
      SELECT b.profile_id 
      FROM public.businesses b 
      JOIN public.ingredients i ON b.id = i.business_id 
      WHERE i.id = ingredient_id
    )
  );

-- Recipes table
CREATE TABLE public.recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES public.businesses(id) NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  portion_size DECIMAL(10, 2) NOT NULL,
  portion_unit TEXT NOT NULL,
  preparation_time INTEGER,
  cooking_time INTEGER,
  instructions TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

-- Create policies for recipes
CREATE POLICY "Recipes are viewable by business owner." 
  ON public.recipes FOR SELECT USING (
    auth.uid() IN (
      SELECT profile_id FROM public.businesses WHERE id = business_id
    )
  );

CREATE POLICY "Business owners can insert recipes." 
  ON public.recipes FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT profile_id FROM public.businesses WHERE id = business_id
    )
  );

CREATE POLICY "Business owners can update recipes." 
  ON public.recipes FOR UPDATE USING (
    auth.uid() IN (
      SELECT profile_id FROM public.businesses WHERE id = business_id
    )
  );

CREATE POLICY "Business owners can delete recipes." 
  ON public.recipes FOR DELETE USING (
    auth.uid() IN (
      SELECT profile_id FROM public.businesses WHERE id = business_id
    )
  );

-- Recipe Ingredients table
CREATE TABLE public.recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE NOT NULL,
  ingredient_id UUID REFERENCES public.ingredients(id) NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit TEXT NOT NULL,
  preparation_method TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.recipe_ingredients ENABLE ROW LEVEL SECURITY;

-- Create policies for recipe_ingredients
CREATE POLICY "Recipe ingredients are viewable by business owner." 
  ON public.recipe_ingredients FOR SELECT USING (
    auth.uid() IN (
      SELECT b.profile_id 
      FROM public.businesses b 
      JOIN public.recipes r ON b.id = r.business_id 
      WHERE r.id = recipe_id
    )
  );

CREATE POLICY "Business owners can insert recipe ingredients." 
  ON public.recipe_ingredients FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT b.profile_id 
      FROM public.businesses b 
      JOIN public.recipes r ON b.id = r.business_id 
      WHERE r.id = recipe_id
    )
  );

CREATE POLICY "Business owners can update recipe ingredients." 
  ON public.recipe_ingredients FOR UPDATE USING (
    auth.uid() IN (
      SELECT b.profile_id 
      FROM public.businesses b 
      JOIN public.recipes r ON b.id = r.business_id 
      WHERE r.id = recipe_id
    )
  );

CREATE POLICY "Business owners can delete recipe ingredients." 
  ON public.recipe_ingredients FOR DELETE USING (
    auth.uid() IN (
      SELECT b.profile_id 
      FROM public.businesses b 
      JOIN public.recipes r ON b.id = r.business_id 
      WHERE r.id = recipe_id
    )
  );

-- Menu Items table
CREATE TABLE public.menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES public.businesses(id) NOT NULL,
  recipe_id UUID REFERENCES public.recipes(id),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  selling_price DECIMAL(10, 2) NOT NULL,
  cost_price DECIMAL(10, 2) NOT NULL,
  profit_margin DECIMAL(10, 2) NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Create policies for menu_items
CREATE POLICY "Menu items are viewable by business owner." 
  ON public.menu_items FOR SELECT USING (
    auth.uid() IN (
      SELECT profile_id FROM public.businesses WHERE id = business_id
    )
  );

CREATE POLICY "Business owners can insert menu items." 
  ON public.menu_items FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT profile_id FROM public.businesses WHERE id = business_id
    )
  );

CREATE POLICY "Business owners can update menu items." 
  ON public.menu_items FOR UPDATE USING (
    auth.uid() IN (
      SELECT profile_id FROM public.businesses WHERE id = business_id
    )
  );

CREATE POLICY "Business owners can delete menu items." 
  ON public.menu_items FOR DELETE USING (
    auth.uid() IN (
      SELECT profile_id FROM public.businesses WHERE id = business_id
    )
  );

-- Promotions table
CREATE TABLE public.promotions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES public.businesses(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10, 2) NOT NULL,
  min_purchase DECIMAL(10, 2),
  max_discount DECIMAL(10, 2),
  applicable_items JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

-- Create policies for promotions
CREATE POLICY "Promotions are viewable by business owner." 
  ON public.promotions FOR SELECT USING (
    auth.uid() IN (
      SELECT profile_id FROM public.businesses WHERE id = business_id
    )
  );

CREATE POLICY "Business owners can insert promotions." 
  ON public.promotions FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT profile_id FROM public.businesses WHERE id = business_id
    )
  );

CREATE POLICY "Business owners can update promotions." 
  ON public.promotions FOR UPDATE USING (
    auth.uid() IN (
      SELECT profile_id FROM public.businesses WHERE id = business_id
    )
  );

CREATE POLICY "Business owners can delete promotions." 
  ON public.promotions FOR DELETE USING (
    auth.uid() IN (
      SELECT profile_id FROM public.businesses WHERE id = business_id
    )
  );

-- Customers table
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES public.businesses(id) NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  loyalty_points INTEGER DEFAULT 0,
  membership_level TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Create policies for customers
CREATE POLICY "Customers are viewable by business owner." 
  ON public.customers FOR SELECT USING (
    auth.uid() IN (
      SELECT profile_id FROM public.businesses WHERE id = business_id
    )
  );

CREATE POLICY "Business owners can insert customers." 
  ON public.customers FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT profile_id FROM public.businesses WHERE id = business_id
    )
  );

CREATE POLICY "Business owners can update customers." 
  ON public.customers FOR UPDATE USING (
    auth.uid() IN (
      SELECT profile_id FROM public.businesses WHERE id = business_id
    )
  );

CREATE POLICY "Business owners can delete customers." 
  ON public.customers FOR DELETE USING (
    auth.uid() IN (
      SELECT profile_id FROM public.businesses WHERE id = business_id
    )
  );

-- Sales table
CREATE TABLE public.sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES public.businesses(id) NOT NULL,
  date DATE NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  payment_method TEXT,
  customer_id UUID REFERENCES public.customers(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- Create policies for sales
CREATE POLICY "Sales are viewable by business owner." 
  ON public.sales FOR SELECT USING (
    auth.uid() IN (
      SELECT profile_id FROM public.businesses WHERE id = business_id
    )
  );

CREATE POLICY "Business owners can insert sales." 
  ON public.sales FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT profile_id FROM public.businesses WHERE id = business_id
    )
  );

CREATE POLICY "Business owners can update sales." 
  ON public.sales FOR UPDATE USING (
    auth.uid() IN (
      SELECT profile_id FROM public.businesses WHERE id = business_id
    )
  );

CREATE POLICY "Business owners can delete sales." 
  ON public.sales FOR DELETE USING (
    auth.uid() IN (
      SELECT profile_id FROM public.businesses WHERE id = business_id
    )
  );

-- Sale Items table
CREATE TABLE public.sale_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_id UUID REFERENCES public.sales(id) ON DELETE CASCADE NOT NULL,
  menu_item_id UUID REFERENCES public.menu_items(id) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) DEFAULT 0,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;

-- Create policies for sale_items
CREATE POLICY "Sale items are viewable by business owner." 
  ON public.sale_items FOR SELECT USING (
    auth.uid() IN (
      SELECT b.profile_id 
      FROM public.businesses b 
      JOIN public.sales s ON b.id = s.business_id 
      WHERE s.id = sale_id
    )
  );

CREATE POLICY "Business owners can insert sale items." 
  ON public.sale_items FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT b.profile_id 
      FROM public.businesses b 
      JOIN public.sales s ON b.id = s.business_id 
      WHERE s.id = sale_id
    )
  );

CREATE POLICY "Business owners can update sale items." 
  ON public.sale_items FOR UPDATE USING (
    auth.uid() IN (
      SELECT b.profile_id 
      FROM public.businesses b 
      JOIN public.sales s ON b.id = s.business_id 
      WHERE s.id = sale_id
    )
  );

CREATE POLICY "Business owners can delete sale items." 
  ON public.sale_items FOR DELETE USING (
    auth.uid() IN (
      SELECT b.profile_id 
      FROM public.businesses b 
      JOIN public.sales s ON b.id = s.business_id 
      WHERE s.id = sale_id
    )
  );

-- Purchases table
CREATE TABLE public.purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES public.businesses(id) NOT NULL,
  supplier_id UUID REFERENCES public.suppliers(id) NOT NULL,
  date DATE NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_status TEXT NOT NULL CHECK (payment_status IN ('pending', 'partial', 'paid')),
  delivery_status TEXT NOT NULL CHECK (delivery_status IN ('pending', 'partial', 'delivered')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Create policies for purchases
CREATE POLICY "Purchases are viewable by business owner." 
  ON public.purchases FOR SELECT USING (
    auth.uid() IN (
      SELECT profile_id FROM public.businesses WHERE id = business_id
    )
  );

CREATE POLICY "Business owners can insert purchases." 
  ON public.purchases FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT profile_id FROM public.businesses WHERE id = business_id
    )
  );

CREATE POLICY "Business owners can update purchases." 
  ON public.purchases FOR UPDATE USING (
    auth.uid() IN (
      SELECT profile_id FROM public.businesses WHERE id = business_id
    )
  );

CREATE POLICY "Business owners can delete purchases." 
  ON public.purchases FOR DELETE USING (
    auth.uid() IN (
      SELECT profile_id FROM public.businesses WHERE id = business_id
    )
  );

-- Purchase Items table
CREATE TABLE public.purchase_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  purchase_id UUID REFERENCES public.purchases(id) ON DELETE CASCADE NOT NULL,
  ingredient_id UUID REFERENCES public.ingredients(id) NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.purchase_items ENABLE ROW LEVEL SECURITY;

-- Create policies for purchase_items
CREATE POLICY "Purchase items are viewable by business owner." 
  ON public.purchase_items FOR SELECT USING (
    auth.uid() IN (
      SELECT b.profile_id 
      FROM public.businesses b 
      JOIN public.purchases p ON b.id = p.business_id 
      WHERE p.id = purchase_id
    )
  );

CREATE POLICY "Business owners can insert purchase items." 
  ON public.purchase_items FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT b.profile_id 
      FROM public.businesses b 
      JOIN public.purchases p ON b.id = p.business_id 
      WHERE p.id = purchase_id
    )
  );

CREATE POLICY "Business owners can update purchase items." 
  ON public.purchase_items FOR UPDATE USING (
    auth.uid() IN (
      SELECT b.profile_id 
      FROM public.businesses b 
      JOIN public.purchases p ON b.id = p.business_id 
      WHERE p.id = purchase_id
    )
  );

CREATE POLICY "Business owners can delete purchase items." 
  ON public.purchase_items FOR DELETE USING (
    auth.uid() IN (
      SELECT b.profile_id 
      FROM public.businesses b 
      JOIN public.purchases p ON b.id = p.business_id 
      WHERE p.id = purchase_id
    )
  );

-- Business Plans table
CREATE TABLE public.business_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES public.businesses(id) NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  target_revenue DECIMAL(10, 2),
  target_profit DECIMAL(10, 2),
  budget DECIMAL(10, 2),
  status TEXT NOT NULL CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.business_plans ENABLE ROW LEVEL SECURITY;

-- Create policies for business_plans
CREATE POLICY "Business plans are viewable by business owner." 
  ON public.business_plans FOR SELECT USING (
    auth.uid() IN (
      SELECT profile_id FROM public.businesses WHERE id = business_id
    )
  );

CREATE POLICY "Business owners can insert business plans." 
  ON public.business_plans FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT profile_id FROM public.businesses WHERE id = business_id
    )
  );

CREATE POLICY "Business owners can update business plans." 
  ON public.business_plans FOR UPDATE USING (
    auth.uid() IN (
      SELECT profile_id FROM public.businesses WHERE id = business_id
    )
  );

CREATE POLICY "Business owners can delete business plans." 
  ON public.business_plans FOR DELETE USING (
    auth.uid() IN (
      SELECT profile_id FROM public.businesses WHERE id = business_id
    )
  );

-- Create function to calculate recipe cost
CREATE OR REPLACE FUNCTION calculate_recipe_cost(recipe_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  total_cost DECIMAL(10, 2) := 0;
BEGIN
  SELECT SUM(ri.quantity * i.cost_per_unit)
  INTO total_cost
  FROM public.recipe_ingredients ri
  JOIN public.ingredients i ON ri.ingredient_id = i.id
  WHERE ri.recipe_id = calculate_recipe_cost.recipe_id;
  
  RETURN COALESCE(total_cost, 0);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update inventory when purchase is made
CREATE OR REPLACE FUNCTION update_inventory_on_purchase()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if inventory record exists
  IF EXISTS (
    SELECT 1 FROM public.inventory WHERE ingredient_id = NEW.ingredient_id
  ) THEN
    -- Update existing inventory
    UPDATE public.inventory
    SET quantity = quantity + NEW.quantity,
        last_updated = now(),
        updated_at = now()
    WHERE ingredient_id = NEW.ingredient_id;
  ELSE
    -- Create new inventory record
    INSERT INTO public.inventory (ingredient_id, quantity)
    VALUES (NEW.ingredient_id, NEW.quantity);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_inventory_on_purchase
AFTER INSERT ON public.purchase_items
FOR EACH ROW
EXECUTE FUNCTION update_inventory_on_purchase();

-- Create trigger to update inventory when sale is made
CREATE OR REPLACE FUNCTION update_inventory_on_sale()
RETURNS TRIGGER AS $$
DECLARE
  ingredient_record RECORD;
BEGIN
  -- For each ingredient in the recipe of the sold menu item
  FOR ingredient_record IN (
    SELECT ri.ingredient_id, ri.quantity * NEW.quantity AS total_quantity
    FROM public.recipe_ingredients ri
    JOIN public.menu_items mi ON ri.recipe_id = mi.recipe_id
    WHERE mi.id = NEW.menu_item_id AND mi.recipe_id IS NOT NULL
  ) LOOP
    -- Update inventory
    UPDATE public.inventory
    SET quantity = quantity - ingredient_record.total_quantity,
        last_updated = now(),
        updated_at = now()
    WHERE ingredient_id = ingredient_record.ingredient_id;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_inventory_on_sale
AFTER INSERT ON public.sale_items
FOR EACH ROW
EXECUTE FUNCTION update_inventory_on_sale();
