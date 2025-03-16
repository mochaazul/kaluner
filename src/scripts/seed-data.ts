import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Supabase URL atau Service Key tidak ditemukan di file .env.local');
  process.exit(1);
}

// Inisialisasi klien Supabase dengan service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ID bisnis default (akan diambil dari database)
let businessId = '';

// Data bahan-bahan
const ingredients = [
  {
    name: 'Tepung Terigu',
    category: 'Bahan Kering',
    unit: 'kilogram',
    cost_per_unit: 12000,
    min_stock_level: 5,
  },
  {
    name: 'Gula Pasir',
    category: 'Bahan Kering',
    unit: 'kilogram',
    cost_per_unit: 15000,
    min_stock_level: 3,
  },
  {
    name: 'Telur Ayam',
    category: 'Bahan Basah',
    unit: 'butir',
    cost_per_unit: 2000,
    min_stock_level: 10,
  },
  {
    name: 'Mentega',
    category: 'Bahan Basah',
    unit: 'kilogram',
    cost_per_unit: 45000,
    min_stock_level: 2,
  },
  {
    name: 'Coklat Bubuk',
    category: 'Bahan Kering',
    unit: 'kilogram',
    cost_per_unit: 80000,
    min_stock_level: 1,
  },
  {
    name: 'Susu Cair',
    category: 'Bahan Basah',
    unit: 'liter',
    cost_per_unit: 18000,
    min_stock_level: 2,
  },
  {
    name: 'Baking Powder',
    category: 'Bahan Kering',
    unit: 'kilogram',
    cost_per_unit: 35000,
    min_stock_level: 1,
  },
  {
    name: 'Vanili Bubuk',
    category: 'Bahan Kering',
    unit: 'gram',
    cost_per_unit: 500,
    min_stock_level: 100,
  },
  {
    name: 'Garam',
    category: 'Bahan Kering',
    unit: 'kilogram',
    cost_per_unit: 10000,
    min_stock_level: 1,
  },
  {
    name: 'Minyak Goreng',
    category: 'Bahan Basah',
    unit: 'liter',
    cost_per_unit: 20000,
    min_stock_level: 2,
  },
  {
    name: 'Beras',
    category: 'Bahan Kering',
    unit: 'kilogram',
    cost_per_unit: 13000,
    min_stock_level: 5,
  },
  {
    name: 'Ayam Fillet',
    category: 'Daging',
    unit: 'kilogram',
    cost_per_unit: 40000,
    min_stock_level: 2,
  },
  {
    name: 'Bawang Putih',
    category: 'Bumbu',
    unit: 'kilogram',
    cost_per_unit: 30000,
    min_stock_level: 1,
  },
  {
    name: 'Bawang Merah',
    category: 'Bumbu',
    unit: 'kilogram',
    cost_per_unit: 35000,
    min_stock_level: 1,
  },
  {
    name: 'Cabai Merah',
    category: 'Bumbu',
    unit: 'kilogram',
    cost_per_unit: 40000,
    min_stock_level: 1,
  },
];

// Data resep
const recipes = [
  {
    name: 'Kue Coklat',
    category: 'Makanan Penutup',
    portion_size: 10,
    portion_unit: 'porsi',
    preparation_time: 20,
    cooking_time: 40,
    instructions: `
1. Panaskan oven pada suhu 180°C.
2. Campur tepung terigu, coklat bubuk, baking powder, dan garam.
3. Di wadah terpisah, kocok mentega dan gula hingga pucat dan mengembang.
4. Tambahkan telur satu per satu, kocok hingga tercampur rata.
5. Masukkan campuran tepung secara bertahap, aduk perlahan.
6. Tuang adonan ke loyang yang sudah diolesi mentega.
7. Panggang selama 35-40 menit atau hingga matang.
8. Dinginkan sebelum disajikan.
    `,
    notes: 'Kue ini bisa disimpan dalam wadah kedap udara selama 3 hari.',
  },
  {
    name: 'Nasi Goreng Ayam',
    category: 'Makanan Utama',
    portion_size: 2,
    portion_unit: 'porsi',
    preparation_time: 10,
    cooking_time: 15,
    instructions: `
1. Tumis bawang putih dan bawang merah hingga harum.
2. Masukkan potongan ayam, masak hingga berubah warna.
3. Tambahkan nasi, aduk rata.
4. Bumbui dengan kecap manis, garam, dan merica.
5. Aduk hingga semua bahan tercampur rata dan matang.
6. Sajikan dengan telur mata sapi dan kerupuk.
    `,
    notes: 'Gunakan nasi dingin untuk hasil yang lebih baik.',
  },
];

// Fungsi untuk membuat profil dan bisnis
async function createProfileAndBusiness() {
  console.log('Membuat profil dan bisnis demo...');
  
  // Gunakan ID user yang sudah ada
  const userId = '0fafad5d-d761-491b-bb0e-f7d327645c59';
  
  // Periksa apakah profil sudah ada
  const { data: existingProfile, error: checkProfileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .limit(1);
  
  if (!checkProfileError && existingProfile && existingProfile.length > 0) {
    console.log(`Profil dengan ID ${userId} sudah ada, menggunakan profil tersebut`);
    return userId;
  }
  
  // Buat profil baru dengan ID user yang sudah ada
  const { error: profileError } = await supabase.from('profiles').insert({
    id: userId,
    username: 'demo_user',
    full_name: 'Demo User',
    created_at: new Date().toISOString(),
  });
  
  if (profileError) {
    console.error('Gagal membuat profil demo:', profileError);
    return null;
  }
  
  console.log(`Profil demo berhasil dibuat dengan ID: ${userId}`);
  return userId;
}

// Fungsi untuk mendapatkan ID bisnis
async function getBusinessId() {
  console.log('Mencari ID bisnis...');
  
  const { data, error } = await supabase.from('businesses').select('id').limit(1);
  
  if (error || !data || data.length === 0) {
    console.log('Tidak dapat menemukan ID bisnis, membuat bisnis baru...');
    
    // Dapatkan atau buat profil
    const profileId = await createProfileAndBusiness();
    
    if (!profileId) {
      console.error('Tidak dapat mendapatkan ID profil. Proses dihentikan.');
      return null;
    }
    
    // Buat bisnis baru
    const businessId = uuidv4();
    const { error: newBusinessError } = await supabase
      .from('businesses')
      .insert({
        id: businessId,
        profile_id: profileId,
        business_name: 'Kaluner Demo',
        business_type: 'Kuliner',
        created_at: new Date().toISOString(),
      });
    
    if (newBusinessError) {
      console.error('Gagal membuat bisnis baru:', newBusinessError);
      
      // Coba cari bisnis yang sudah ada
      const { data: existingBusiness, error: findBusinessError } = await supabase
        .from('businesses')
        .select('id')
        .eq('business_name', 'Kaluner Demo')
        .limit(1);
      
      if (findBusinessError || !existingBusiness || existingBusiness.length === 0) {
        console.error('Tidak dapat menemukan bisnis yang sudah ada:', findBusinessError);
        return null;
      }
      
      console.log('Menggunakan bisnis yang sudah ada');
      return existingBusiness[0].id;
    }
    
    console.log(`Bisnis demo berhasil dibuat dengan ID: ${businessId}`);
    return businessId;
  }
  
  console.log(`Menggunakan bisnis yang sudah ada dengan ID: ${data[0].id}`);
  return data[0].id;
}

// Fungsi untuk menambahkan bahan-bahan
async function seedIngredients() {
  console.log('Menambahkan data bahan-bahan...');
  
  // Hapus data bahan yang sudah ada (opsional)
  try {
    const { error: deleteError } = await supabase.from('ingredients').delete().gte('id', '00000000-0000-0000-0000-000000000000');
    if (deleteError) {
      console.error('Gagal menghapus data bahan:', deleteError);
      return false;
    }
  } catch (error) {
    console.log('Tabel ingredients mungkin kosong, melanjutkan...');
  }
  
  // Tambahkan data bahan baru dengan business_id
  const ingredientsWithBusinessId = ingredients.map(ingredient => ({
    ...ingredient,
    business_id: businessId,
    id: uuidv4(),
    created_at: new Date().toISOString(),
  }));
  
  const { error: insertError } = await supabase.from('ingredients').insert(ingredientsWithBusinessId);
  if (insertError) {
    console.error('Gagal menambahkan data bahan:', insertError);
    return false;
  }
  
  console.log(`Berhasil menambahkan ${ingredients.length} bahan`);
  return true;
}

// Fungsi untuk menambahkan resep
async function seedRecipes() {
  console.log('Menambahkan data resep...');
  
  // Hapus data resep dan bahan resep yang sudah ada (opsional)
  try {
    const { error: deleteRecipeIngredientsError } = await supabase.from('recipe_ingredients').delete().gte('id', '00000000-0000-0000-0000-000000000000');
    if (deleteRecipeIngredientsError) {
      console.error('Gagal menghapus data bahan resep:', deleteRecipeIngredientsError);
      return false;
    }
  } catch (error) {
    console.log('Tabel recipe_ingredients mungkin kosong, melanjutkan...');
  }
  
  try {
    const { error: deleteRecipesError } = await supabase.from('recipes').delete().gte('id', '00000000-0000-0000-0000-000000000000');
    if (deleteRecipesError) {
      console.error('Gagal menghapus data resep:', deleteRecipesError);
      return false;
    }
  } catch (error) {
    console.log('Tabel recipes mungkin kosong, melanjutkan...');
  }
  
  // Dapatkan data bahan untuk referensi
  const { data: ingredientsData, error: ingredientsError } = await supabase.from('ingredients').select('*');
  if (ingredientsError || !ingredientsData) {
    console.error('Gagal mengambil data bahan:', ingredientsError);
    return false;
  }
  
  // Tambahkan resep
  for (const recipe of recipes) {
    // Tambahkan resep dengan business_id
    const recipeId = uuidv4();
    const recipeWithBusinessId = {
      ...recipe,
      id: recipeId,
      business_id: businessId,
      created_at: new Date().toISOString(),
    };
    
    const { error: recipeError } = await supabase
      .from('recipes')
      .insert(recipeWithBusinessId);
    
    if (recipeError) {
      console.error(`Gagal menambahkan resep ${recipe.name}:`, recipeError);
      continue;
    }
    
    // Tambahkan bahan-bahan resep
    const recipeIngredients = [];
    
    // Kue Coklat
    if (recipe.name === 'Kue Coklat') {
      const tepungId = ingredientsData.find(i => i.name === 'Tepung Terigu')?.id;
      const gulaId = ingredientsData.find(i => i.name === 'Gula Pasir')?.id;
      const telurId = ingredientsData.find(i => i.name === 'Telur Ayam')?.id;
      const mentegaId = ingredientsData.find(i => i.name === 'Mentega')?.id;
      const coklatId = ingredientsData.find(i => i.name === 'Coklat Bubuk')?.id;
      const bakingPowderId = ingredientsData.find(i => i.name === 'Baking Powder')?.id;
      const garamId = ingredientsData.find(i => i.name === 'Garam')?.id;
      
      if (tepungId) recipeIngredients.push({ id: uuidv4(), recipe_id: recipeId, ingredient_id: tepungId, quantity: 0.25, unit: 'kilogram', created_at: new Date().toISOString() });
      if (gulaId) recipeIngredients.push({ id: uuidv4(), recipe_id: recipeId, ingredient_id: gulaId, quantity: 0.2, unit: 'kilogram', created_at: new Date().toISOString() });
      if (telurId) recipeIngredients.push({ id: uuidv4(), recipe_id: recipeId, ingredient_id: telurId, quantity: 4, unit: 'butir', created_at: new Date().toISOString() });
      if (mentegaId) recipeIngredients.push({ id: uuidv4(), recipe_id: recipeId, ingredient_id: mentegaId, quantity: 0.15, unit: 'kilogram', created_at: new Date().toISOString() });
      if (coklatId) recipeIngredients.push({ id: uuidv4(), recipe_id: recipeId, ingredient_id: coklatId, quantity: 0.05, unit: 'kilogram', created_at: new Date().toISOString() });
      if (bakingPowderId) recipeIngredients.push({ id: uuidv4(), recipe_id: recipeId, ingredient_id: bakingPowderId, quantity: 0.01, unit: 'kilogram', created_at: new Date().toISOString() });
      if (garamId) recipeIngredients.push({ id: uuidv4(), recipe_id: recipeId, ingredient_id: garamId, quantity: 0.005, unit: 'kilogram', created_at: new Date().toISOString() });
    }
    
    // Nasi Goreng Ayam
    if (recipe.name === 'Nasi Goreng Ayam') {
      const berasId = ingredientsData.find(i => i.name === 'Beras')?.id;
      const ayamId = ingredientsData.find(i => i.name === 'Ayam Fillet')?.id;
      const bawangPutihId = ingredientsData.find(i => i.name === 'Bawang Putih')?.id;
      const bawangMerahId = ingredientsData.find(i => i.name === 'Bawang Merah')?.id;
      const minyakId = ingredientsData.find(i => i.name === 'Minyak Goreng')?.id;
      const garamId = ingredientsData.find(i => i.name === 'Garam')?.id;
      const telurId = ingredientsData.find(i => i.name === 'Telur Ayam')?.id;
      
      if (berasId) recipeIngredients.push({ id: uuidv4(), recipe_id: recipeId, ingredient_id: berasId, quantity: 0.25, unit: 'kilogram', created_at: new Date().toISOString() });
      if (ayamId) recipeIngredients.push({ id: uuidv4(), recipe_id: recipeId, ingredient_id: ayamId, quantity: 0.1, unit: 'kilogram', created_at: new Date().toISOString() });
      if (bawangPutihId) recipeIngredients.push({ id: uuidv4(), recipe_id: recipeId, ingredient_id: bawangPutihId, quantity: 0.01, unit: 'kilogram', created_at: new Date().toISOString() });
      if (bawangMerahId) recipeIngredients.push({ id: uuidv4(), recipe_id: recipeId, ingredient_id: bawangMerahId, quantity: 0.02, unit: 'kilogram', created_at: new Date().toISOString() });
      if (minyakId) recipeIngredients.push({ id: uuidv4(), recipe_id: recipeId, ingredient_id: minyakId, quantity: 0.03, unit: 'liter', created_at: new Date().toISOString() });
      if (garamId) recipeIngredients.push({ id: uuidv4(), recipe_id: recipeId, ingredient_id: garamId, quantity: 0.005, unit: 'kilogram', created_at: new Date().toISOString() });
      if (telurId) recipeIngredients.push({ id: uuidv4(), recipe_id: recipeId, ingredient_id: telurId, quantity: 2, unit: 'butir', created_at: new Date().toISOString() });
    }
    
    // Tambahkan bahan-bahan resep ke database
    if (recipeIngredients.length > 0) {
      const { error: recipeIngredientsError } = await supabase
        .from('recipe_ingredients')
        .insert(recipeIngredients);
      
      if (recipeIngredientsError) {
        console.error(`Gagal menambahkan bahan untuk resep ${recipe.name}:`, recipeIngredientsError);
      } else {
        console.log(`Berhasil menambahkan ${recipeIngredients.length} bahan untuk resep ${recipe.name}`);
      }
    }
  }
  
  console.log(`Berhasil menambahkan ${recipes.length} resep`);
  return true;
}

// Fungsi utama untuk menjalankan seeder
async function main() {
  console.log('Memulai proses seeding data...');
  
  // Dapatkan ID bisnis
  businessId = await getBusinessId();
  if (!businessId) {
    console.error('Tidak dapat mendapatkan ID bisnis. Proses dihentikan.');
    process.exit(1);
  }
  
  console.log(`Menggunakan ID bisnis: ${businessId}`);
  
  // Tambahkan bahan-bahan
  const ingredientsSuccess = await seedIngredients();
  if (!ingredientsSuccess) {
    console.error('Gagal menambahkan bahan-bahan. Proses dihentikan.');
    process.exit(1);
  }
  
  // Tambahkan resep
  const recipesSuccess = await seedRecipes();
  if (!recipesSuccess) {
    console.error('Gagal menambahkan resep. Proses dihentikan.');
    process.exit(1);
  }
  
  console.log('Proses seeding data selesai!');
  process.exit(0);
}

// Jalankan fungsi utama
main().catch(error => {
  console.error('Terjadi kesalahan:', error);
  process.exit(1);
});
