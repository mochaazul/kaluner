-- Buat tabel recipe_additional_costs
CREATE TABLE IF NOT EXISTS recipe_additional_costs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tambahkan RLS (Row Level Security) untuk tabel recipe_additional_costs
ALTER TABLE recipe_additional_costs ENABLE ROW LEVEL SECURITY;

-- Buat kebijakan untuk SELECT
CREATE POLICY "Pengguna dapat melihat biaya tambahan resep miliknya" 
ON recipe_additional_costs FOR SELECT 
USING (
  recipe_id IN (
    SELECT r.id FROM recipes r
    JOIN businesses b ON r.business_id = b.id
    JOIN profiles p ON b.profile_id = p.id
    WHERE p.user_id = auth.uid()
  )
);

-- Buat kebijakan untuk INSERT
CREATE POLICY "Pengguna dapat menambahkan biaya tambahan ke resep miliknya" 
ON recipe_additional_costs FOR INSERT 
WITH CHECK (
  recipe_id IN (
    SELECT r.id FROM recipes r
    JOIN businesses b ON r.business_id = b.id
    JOIN profiles p ON b.profile_id = p.id
    WHERE p.user_id = auth.uid()
  )
);

-- Buat kebijakan untuk UPDATE
CREATE POLICY "Pengguna dapat memperbarui biaya tambahan resep miliknya" 
ON recipe_additional_costs FOR UPDATE 
USING (
  recipe_id IN (
    SELECT r.id FROM recipes r
    JOIN businesses b ON r.business_id = b.id
    JOIN profiles p ON b.profile_id = p.id
    WHERE p.user_id = auth.uid()
  )
) 
WITH CHECK (
  recipe_id IN (
    SELECT r.id FROM recipes r
    JOIN businesses b ON r.business_id = b.id
    JOIN profiles p ON b.profile_id = p.id
    WHERE p.user_id = auth.uid()
  )
);

-- Buat kebijakan untuk DELETE
CREATE POLICY "Pengguna dapat menghapus biaya tambahan resep miliknya" 
ON recipe_additional_costs FOR DELETE 
USING (
  recipe_id IN (
    SELECT r.id FROM recipes r
    JOIN businesses b ON r.business_id = b.id
    JOIN profiles p ON b.profile_id = p.id
    WHERE p.user_id = auth.uid()
  )
);

-- Hapus kolom biaya tambahan yang tidak digunakan lagi dari tabel recipes
ALTER TABLE recipes 
DROP COLUMN IF EXISTS labor_cost,
DROP COLUMN IF EXISTS overhead_cost,
DROP COLUMN IF EXISTS packaging_cost;

-- Tambahkan indeks untuk mempercepat query
CREATE INDEX IF NOT EXISTS recipe_additional_costs_recipe_id_idx ON recipe_additional_costs(recipe_id);
