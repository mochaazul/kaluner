-- Menambahkan kolom untuk perhitungan HPP ke tabel recipes
ALTER TABLE recipes
ADD COLUMN IF NOT EXISTS cost_per_serving DECIMAL(10, 2) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS labor_cost DECIMAL(10, 2) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS overhead_cost DECIMAL(10, 2) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS packaging_cost DECIMAL(10, 2) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS waste_factor DECIMAL(5, 4) DEFAULT NULL;

-- Komentar untuk kolom-kolom baru
COMMENT ON COLUMN recipes.cost_per_serving IS 'Biaya per porsi (HPP)';
COMMENT ON COLUMN recipes.labor_cost IS 'Biaya tenaga kerja untuk resep ini';
COMMENT ON COLUMN recipes.overhead_cost IS 'Biaya overhead (listrik, gas, air, dll)';
COMMENT ON COLUMN recipes.packaging_cost IS 'Biaya kemasan dan penyajian';
COMMENT ON COLUMN recipes.waste_factor IS 'Faktor penyusutan dalam desimal (0.05 = 5%)';
