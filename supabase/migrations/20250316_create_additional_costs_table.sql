-- Membuat tabel untuk biaya tambahan resep
CREATE TABLE IF NOT EXISTS recipe_additional_costs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  
  -- Menambahkan foreign key constraint
  CONSTRAINT fk_recipe_additional_costs_recipe FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

-- Menambahkan indeks untuk mempercepat pencarian
CREATE INDEX IF NOT EXISTS idx_recipe_additional_costs_recipe_id ON recipe_additional_costs(recipe_id);

-- Menambahkan komentar untuk tabel dan kolom
COMMENT ON TABLE recipe_additional_costs IS 'Menyimpan biaya tambahan untuk setiap resep';
COMMENT ON COLUMN recipe_additional_costs.name IS 'Nama biaya tambahan (misalnya: Tenaga Kerja, Listrik, dll)';
COMMENT ON COLUMN recipe_additional_costs.amount IS 'Jumlah biaya dalam mata uang yang sama dengan biaya bahan';
COMMENT ON COLUMN recipe_additional_costs.notes IS 'Catatan tambahan mengenai biaya ini';

-- Menghapus kolom biaya tambahan dari tabel recipes karena sekarang disimpan di tabel terpisah
ALTER TABLE recipes
DROP COLUMN IF EXISTS labor_cost,
DROP COLUMN IF EXISTS overhead_cost,
DROP COLUMN IF EXISTS packaging_cost;
