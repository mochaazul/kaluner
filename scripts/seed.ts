import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import * as falso from '@ngneat/falso';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Supabase URL or Service Key is missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Seed data
async function seedDatabase() {
  console.log('🌱 Seeding database...');

  // Generate UUIDs for reference
  const businessIds = {
    business1: uuidv4(),
    business2: uuidv4(),
    business3: uuidv4(),
  };

  // Create auth users first
  console.log('Creating auth users...');
  const users = [
    {
      email: `user1_${falso.randNumber({ min: 1000, max: 9999 })}@example.com`,
      password: 'password123',
      username: falso.randUserName(),
      full_name: falso.randFullName(),
      avatar_url: `https://i.pravatar.cc/150?u=${falso.randUuid()}`,
    },
    {
      email: `user2_${falso.randNumber({ min: 1000, max: 9999 })}@example.com`,
      password: 'password123',
      username: falso.randUserName(),
      full_name: falso.randFullName(),
      avatar_url: `https://i.pravatar.cc/150?u=${falso.randUuid()}`,
    },
    {
      email: `user3_${falso.randNumber({ min: 1000, max: 9999 })}@example.com`,
      password: 'password123',
      username: falso.randUserName(),
      full_name: falso.randFullName(),
      avatar_url: `https://i.pravatar.cc/150?u=${falso.randUuid()}`,
    },
  ];

  // Create users and profiles
  const profileIds = [];
  
  // Create users one by one to handle potential errors individually
  for (const user of users) {
    try {
      // Create the user
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
      });

      if (error) {
        console.error(`Error creating user ${user.email}:`, error);
        continue;
      } else {
        console.log(`Created user: ${user.email}`);
        
        // Store the user ID for later use
        const userId = data.user.id;
        profileIds.push(userId);
        
        // Create the profile
        const { error: profileError } = await supabase.from('profiles').insert({
          id: userId,
          username: user.username,
          full_name: user.full_name,
          avatar_url: user.avatar_url,
          created_at: new Date().toISOString(),
        });
        
        if (profileError) {
          console.error(`Error creating profile for ${user.email}:`, profileError);
          continue;
        }
        
        console.log(`Created profile for: ${user.email}`);
      }
    } catch (error) {
      console.error(`Exception creating user ${user.email}:`, error);
    }
  }
  
  // Check if we have enough profiles to continue
  if (profileIds.length < 3) {
    console.error('Not enough profiles created to continue seeding the database');
    return;
  }

  // Insert businesses
  console.log('Inserting businesses...');
  const businessTypes = ['Restoran', 'Cafe', 'Bakery', 'Food Truck', 'Catering'];
  const businesses = [
    {
      id: businessIds.business1,
      profile_id: profileIds[0],
      business_name: `${falso.randWord()} ${falso.randFood()}`,
      business_type: businessTypes[Math.floor(Math.random() * businessTypes.length)],
      address: falso.randStreetAddress(),
      phone: falso.randPhoneNumber(),
      created_at: new Date().toISOString(),
    },
    {
      id: businessIds.business2,
      profile_id: profileIds[1],
      business_name: `${falso.randWord()} ${falso.randFood()}`,
      business_type: businessTypes[Math.floor(Math.random() * businessTypes.length)],
      address: falso.randStreetAddress(),
      phone: falso.randPhoneNumber(),
      created_at: new Date().toISOString(),
    },
    {
      id: businessIds.business3,
      profile_id: profileIds[2],
      business_name: `${falso.randWord()} ${falso.randFood()}`,
      business_type: businessTypes[Math.floor(Math.random() * businessTypes.length)],
      address: falso.randStreetAddress(),
      phone: falso.randPhoneNumber(),
      created_at: new Date().toISOString(),
    },
  ];

  const { error: businessesError } = await supabase.from('businesses').insert(businesses);

  if (businessesError) {
    console.error('Error inserting businesses:', businessesError);
    return;
  }

  // Insert suppliers
  console.log('Inserting suppliers...');
  const supplierIds = Array(9).fill(0).map(() => uuidv4());
  const suppliers = [];

  for (let i = 0; i < 9; i++) {
    const businessIndex = Math.floor(i / 3); // 3 suppliers per business
    suppliers.push({
      id: supplierIds[i],
      business_id: Object.values(businessIds)[businessIndex],
      name: `${falso.randCompanyName()} ${falso.randProductAdjective()}`,
      contact_person: falso.randFullName(),
      phone: falso.randPhoneNumber(),
      email: falso.randEmail(),
      address: falso.randStreetAddress(),
      created_at: new Date().toISOString(),
    });
  }

  const { error: suppliersError } = await supabase.from('suppliers').insert(suppliers);

  if (suppliersError) {
    console.error('Error inserting suppliers:', suppliersError);
    return;
  }

  // Insert ingredients
  console.log('Inserting ingredients...');
  const ingredientCategories = ['Bahan Pokok', 'Bumbu', 'Daging', 'Sayuran', 'Buah', 'Bahan Pendukung'];
  const units = ['kg', 'gram', 'liter', 'ml', 'pcs', 'ikat', 'pack'];
  
  const ingredientIds = Array(30).fill(0).map(() => uuidv4());
  const ingredients = [];

  for (let i = 0; i < 30; i++) {
    const businessIndex = Math.floor(i / 10); // 10 ingredients per business
    const supplierIndex = Math.floor(i / 3) % 3 + (businessIndex * 3); // Distribute across suppliers
    
    ingredients.push({
      id: ingredientIds[i],
      business_id: Object.values(businessIds)[businessIndex],
      name: falso.randFood(),
      category: ingredientCategories[Math.floor(Math.random() * ingredientCategories.length)],
      unit: units[Math.floor(Math.random() * units.length)],
      cost_per_unit: falso.randNumber({ min: 5000, max: 150000 }),
      supplier_id: supplierIds[supplierIndex],
      min_stock_level: falso.randNumber({ min: 1, max: 20 }),
      created_at: new Date().toISOString(),
    });
  }

  const { error: ingredientsError } = await supabase.from('ingredients').insert(ingredients);

  if (ingredientsError) {
    console.error('Error inserting ingredients:', ingredientsError);
    return;
  }

  // Insert inventory
  console.log('Inserting inventory...');
  const locations = ['Gudang Utama', 'Freezer', 'Rak Bumbu', 'Kulkas', 'Gudang Kering'];
  const inventory = [];

  for (let i = 0; i < ingredientIds.length; i++) {
    inventory.push({
      ingredient_id: ingredientIds[i],
      quantity: falso.randNumber({ min: 1, max: 50, fraction: 2 }),
      expiry_date: falso.randFutureDate().toISOString().split('T')[0],
      location: locations[Math.floor(Math.random() * locations.length)],
      batch_number: falso.randAlphaNumeric({ length: 8 }).join('').toUpperCase(),
      last_updated: new Date().toISOString(),
      created_at: new Date().toISOString(),
    });
  }

  const { error: inventoryError } = await supabase.from('inventory').insert(inventory);

  if (inventoryError) {
    console.error('Error inserting inventory:', inventoryError);
    return;
  }

  // Insert recipes
  console.log('Inserting recipes...');
  const recipeCategories = ['Makanan Utama', 'Makanan Pembuka', 'Makanan Penutup', 'Minuman', 'Camilan'];
  const portionUnits = ['porsi', 'pcs', 'gelas', 'mangkok', 'piring'];
  
  const recipeIds = Array(15).fill(0).map(() => uuidv4());
  const recipes = [];

  for (let i = 0; i < 15; i++) {
    const businessIndex = Math.floor(i / 5); // 5 recipes per business
    
    recipes.push({
      id: recipeIds[i],
      business_id: Object.values(businessIds)[businessIndex],
      name: `${falso.randWord()} ${falso.randFood()}`,
      category: recipeCategories[Math.floor(Math.random() * recipeCategories.length)],
      portion_size: falso.randNumber({ min: 1, max: 4 }),
      portion_unit: portionUnits[Math.floor(Math.random() * portionUnits.length)],
      preparation_time: falso.randNumber({ min: 5, max: 30 }),
      cooking_time: falso.randNumber({ min: 5, max: 60 }),
      instructions: Array(falso.randNumber({ min: 3, max: 8 }))
        .fill(0)
        .map((_, index) => `${index + 1}. ${falso.randSentence()}`)
        .join('\\n'),
      notes: falso.randSentence(),
      created_at: new Date().toISOString(),
    });
  }

  const { error: recipesError } = await supabase.from('recipes').insert(recipes);

  if (recipesError) {
    console.error('Error inserting recipes:', recipesError);
    return;
  }

  // Insert recipe ingredients
  console.log('Inserting recipe ingredients...');
  const recipeIngredients = [];

  for (let i = 0; i < recipeIds.length; i++) {
    const businessIndex = Math.floor(i / 5); // Match business index from recipes
    const ingredientsForBusiness = ingredients.filter(
      ing => ing.business_id === Object.values(businessIds)[businessIndex]
    );
    
    // Each recipe has 3-7 ingredients
    const numIngredients = falso.randNumber({ min: 3, max: 7 });
    const selectedIngredients = falso.randNumber({ min: numIngredients, max: numIngredients }) > 0 
      ? ingredientsForBusiness.sort(() => 0.5 - Math.random()).slice(0, numIngredients) 
      : [];
    
    for (const ingredient of selectedIngredients) {
      recipeIngredients.push({
        recipe_id: recipeIds[i],
        ingredient_id: ingredient.id,
        quantity: falso.randNumber({ min: 0.01, max: 1, fraction: 2 }),
        unit: ingredient.unit,
        preparation_method: ['Dipotong', 'Dihaluskan', 'Dicincang', 'Diiris tipis', 
          'Diparut', 'Direbus', 'Dikukus', 'Digoreng', null][Math.floor(Math.random() * 9)],
        notes: falso.randBoolean() ? falso.randSentence() : null,
        created_at: new Date().toISOString(),
      });
    }
  }

  const { error: recipeIngredientsError } = await supabase.from('recipe_ingredients').insert(recipeIngredients);

  if (recipeIngredientsError) {
    console.error('Error inserting recipe ingredients:', recipeIngredientsError);
    return;
  }

  // Insert menu items
  console.log('Inserting menu items...');
  const menuItemIds = Array(15).fill(0).map(() => uuidv4());
  const menuItems = [];

  for (let i = 0; i < recipeIds.length; i++) {
    const recipe = recipes[i];
    const costPrice = falso.randNumber({ min: 5000, max: 30000 });
    const profitMargin = falso.randNumber({ min: 5000, max: 20000 });
    const sellingPrice = costPrice + profitMargin;
    
    menuItems.push({
      id: menuItemIds[i],
      business_id: recipe.business_id,
      recipe_id: recipe.id,
      name: recipe.name,
      description: falso.randSentence(),
      category: recipe.category,
      selling_price: sellingPrice,
      cost_price: costPrice,
      profit_margin: profitMargin,
      is_active: falso.randBoolean(),
      created_at: new Date().toISOString(),
    });
  }

  const { error: menuItemsError } = await supabase.from('menu_items').insert(menuItems);

  if (menuItemsError) {
    console.error('Error inserting menu items:', menuItemsError);
    return;
  }

  // Insert promotions
  console.log('Inserting promotions...');
  const promotionIds = Array(6).fill(0).map(() => uuidv4());
  const discountTypes = ['percentage', 'fixed'];
  const promotions = [];

  for (let i = 0; i < 6; i++) {
    const businessIndex = Math.floor(i / 2); // 2 promotions per business
    const startDate = falso.randRecentDate();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + falso.randNumber({ min: 7, max: 90 }));
    
    const discountType = discountTypes[Math.floor(Math.random() * discountTypes.length)];
    const discountValue = discountType === 'percentage' 
      ? falso.randNumber({ min: 5, max: 30 }) 
      : falso.randNumber({ min: 5000, max: 20000 });
    
    const menuItemsForBusiness = menuItems.filter(item => 
      item.business_id === Object.values(businessIds)[businessIndex]
    );
    
    const numCategories = falso.randNumber({ min: 1, max: 3 });
    const selectedCategories = falso.randNumber({ min: numCategories, max: numCategories }) > 0
      ? [...new Set(recipeCategories)].sort(() => 0.5 - Math.random()).slice(0, numCategories)
      : [];
    
    const numMenuItems = falso.randNumber({ min: 1, max: 3 });
    const selectedMenuItems = falso.randNumber({ min: numMenuItems, max: numMenuItems }) > 0
      ? menuItemsForBusiness.sort(() => 0.5 - Math.random()).slice(0, numMenuItems).map(item => item.id)
      : [];
    
    promotions.push({
      id: promotionIds[i],
      business_id: Object.values(businessIds)[businessIndex],
      name: `${falso.randProductAdjective()} ${falso.randWord()} ${falso.randNumber({ min: 1, max: 99 })}`,
      description: falso.randSentence(),
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      discount_type: discountType,
      discount_value: discountValue,
      min_purchase: falso.randNumber({ min: 20000, max: 100000 }),
      max_discount: discountType === 'percentage' ? falso.randNumber({ min: 20000, max: 50000 }) : null,
      applicable_items: falso.randBoolean() ? JSON.stringify({
        categories: selectedCategories,
        items: selectedMenuItems
      }) : null,
      created_at: new Date().toISOString(),
    });
  }

  const { error: promotionsError } = await supabase.from('promotions').insert(promotions);

  if (promotionsError) {
    console.error('Error inserting promotions:', promotionsError);
    return;
  }

  // Insert customers
  console.log('Inserting customers...');
  const customerIds = Array(15).fill(0).map(() => uuidv4());
  const membershipLevels = ['Bronze', 'Silver', 'Gold', 'Platinum', null];
  const customers = [];

  for (let i = 0; i < 15; i++) {
    const businessIndex = Math.floor(i / 5); // 5 customers per business
    
    customers.push({
      id: customerIds[i],
      business_id: Object.values(businessIds)[businessIndex],
      name: falso.randFullName(),
      phone: falso.randPhoneNumber(),
      email: falso.randEmail(),
      address: falso.randStreetAddress(),
      loyalty_points: falso.randNumber({ min: 0, max: 1000 }),
      membership_level: membershipLevels[Math.floor(Math.random() * membershipLevels.length)],
      created_at: new Date().toISOString(),
    });
  }

  const { error: customersError } = await supabase.from('customers').insert(customers);

  if (customersError) {
    console.error('Error inserting customers:', customersError);
    return;
  }

  // Insert sales
  console.log('Inserting sales...');
  const paymentMethods = ['Cash', 'Debit', 'Credit Card', 'E-Wallet', 'Bank Transfer'];
  const saleIds = Array(30).fill(0).map(() => uuidv4());
  const sales = [];

  for (let i = 0; i < 30; i++) {
    const businessIndex = Math.floor(i / 10); // 10 sales per business
    const customersForBusiness = customers.filter(
      c => c.business_id === Object.values(businessIds)[businessIndex]
    );
    
    const totalAmount = falso.randNumber({ min: 20000, max: 500000 });
    const discountAmount = falso.randNumber({ min: 0, max: totalAmount * 0.2 });
    const taxAmount = (totalAmount - discountAmount) * 0.1;
    
    sales.push({
      id: saleIds[i],
      business_id: Object.values(businessIds)[businessIndex],
      date: falso.randRecentDate().toISOString().split('T')[0],
      total_amount: totalAmount,
      discount_amount: discountAmount,
      tax_amount: taxAmount,
      payment_method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      customer_id: falso.randBoolean() 
        ? customersForBusiness[Math.floor(Math.random() * customersForBusiness.length)].id 
        : null,
      notes: falso.randBoolean() ? falso.randSentence() : null,
      created_at: new Date().toISOString(),
    });
  }

  const { error: salesError } = await supabase.from('sales').insert(sales);

  if (salesError) {
    console.error('Error inserting sales:', salesError);
    return;
  }

  // Insert sale items
  console.log('Inserting sale items...');
  const saleItems = [];

  for (let i = 0; i < saleIds.length; i++) {
    const sale = sales[i];
    const menuItemsForBusiness = menuItems.filter(
      item => item.business_id === sale.business_id
    );
    
    // Each sale has 1-5 items
    const numItems = falso.randNumber({ min: 1, max: 5 });
    const selectedMenuItems = falso.randNumber({ min: numItems, max: numItems }) > 0
      ? menuItemsForBusiness.sort(() => 0.5 - Math.random()).slice(0, numItems)
      : [];
    
    for (const menuItem of selectedMenuItems) {
      const quantity = falso.randNumber({ min: 1, max: 5 });
      const unitPrice = menuItem.selling_price;
      const discount = falso.randBoolean() 
        ? falso.randNumber({ min: 0, max: unitPrice * 0.2 }) 
        : 0;
      const subtotal = quantity * (unitPrice - discount);
      
      saleItems.push({
        sale_id: saleIds[i],
        menu_item_id: menuItem.id,
        quantity: quantity,
        unit_price: unitPrice,
        discount: discount,
        subtotal: subtotal,
        created_at: new Date().toISOString(),
      });
    }
  }

  const { error: saleItemsError } = await supabase.from('sale_items').insert(saleItems);

  if (saleItemsError) {
    console.error('Error inserting sale items:', saleItemsError);
    return;
  }

  // Insert purchases
  console.log('Inserting purchases...');
  const purchaseStatuses = ['pending', 'partial', 'paid'];
  const deliveryStatuses = ['pending', 'partial', 'delivered'];
  const purchaseIds = Array(15).fill(0).map(() => uuidv4());
  const purchases = [];

  for (let i = 0; i < 15; i++) {
    const businessIndex = Math.floor(i / 5); // 5 purchases per business
    const suppliersForBusiness = suppliers.filter(
      s => s.business_id === Object.values(businessIds)[businessIndex]
    );
    
    purchases.push({
      id: purchaseIds[i],
      business_id: Object.values(businessIds)[businessIndex],
      supplier_id: suppliersForBusiness[Math.floor(Math.random() * suppliersForBusiness.length)].id,
      date: falso.randRecentDate().toISOString().split('T')[0],
      total_amount: falso.randNumber({ min: 100000, max: 2000000 }),
      payment_status: purchaseStatuses[Math.floor(Math.random() * purchaseStatuses.length)],
      delivery_status: deliveryStatuses[Math.floor(Math.random() * deliveryStatuses.length)],
      notes: falso.randBoolean() ? falso.randSentence() : null,
      created_at: new Date().toISOString(),
    });
  }

  const { error: purchasesError } = await supabase.from('purchases').insert(purchases);

  if (purchasesError) {
    console.error('Error inserting purchases:', purchasesError);
    return;
  }

  // Insert purchase items
  console.log('Inserting purchase items...');
  const purchaseItems = [];

  for (let i = 0; i < purchaseIds.length; i++) {
    const purchase = purchases[i];
    const ingredientsForBusiness = ingredients.filter(
      ing => ing.business_id === purchase.business_id
    );
    
    // Each purchase has 3-10 items
    const numItems = falso.randNumber({ min: 3, max: 10 });
    const selectedIngredients = falso.randNumber({ min: numItems, max: numItems }) > 0
      ? ingredientsForBusiness.sort(() => 0.5 - Math.random()).slice(0, numItems)
      : [];
    
    for (const ingredient of selectedIngredients) {
      const quantity = falso.randNumber({ min: 1, max: 20, fraction: 2 });
      const unitPrice = ingredient.cost_per_unit;
      const subtotal = quantity * unitPrice;
      
      purchaseItems.push({
        purchase_id: purchaseIds[i],
        ingredient_id: ingredient.id,
        quantity: quantity,
        unit_price: unitPrice,
        subtotal: subtotal,
        created_at: new Date().toISOString(),
      });
    }
  }

  const { error: purchaseItemsError } = await supabase.from('purchase_items').insert(purchaseItems);

  if (purchaseItemsError) {
    console.error('Error inserting purchase items:', purchaseItemsError);
    return;
  }

  // Insert business plans
  console.log('Inserting business plans...');
  const planTypes = ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'];
  const planStatuses = ['draft', 'active', 'completed', 'cancelled'];
  const businessPlans = [];

  for (let i = 0; i < 9; i++) {
    const businessIndex = Math.floor(i / 3); // 3 plans per business
    const planType = planTypes[Math.floor(Math.random() * planTypes.length)];
    const startDate = falso.randRecentDate();
    const endDate = new Date(startDate);
    
    // Set end date based on plan type
    switch (planType) {
      case 'daily':
        endDate.setDate(startDate.getDate() + 1);
        break;
      case 'weekly':
        endDate.setDate(startDate.getDate() + 7);
        break;
      case 'monthly':
        endDate.setMonth(startDate.getMonth() + 1);
        break;
      case 'quarterly':
        endDate.setMonth(startDate.getMonth() + 3);
        break;
      case 'yearly':
        endDate.setFullYear(startDate.getFullYear() + 1);
        break;
    }
    
    businessPlans.push({
      business_id: Object.values(businessIds)[businessIndex],
      name: `${planType.charAt(0).toUpperCase() + planType.slice(1)} Plan ${falso.randNumber({ min: 1, max: 10 })}`,
      type: planType,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      target_revenue: falso.randNumber({ min: 5000000, max: 50000000 }),
      target_profit: falso.randNumber({ min: 1000000, max: 20000000 }),
      budget: falso.randNumber({ min: 1000000, max: 10000000 }),
      status: planStatuses[Math.floor(Math.random() * planStatuses.length)],
      created_at: new Date().toISOString(),
    });
  }

  const { error: businessPlansError } = await supabase.from('business_plans').insert(businessPlans);

  if (businessPlansError) {
    console.error('Error inserting business plans:', businessPlansError);
    return;
  }

  console.log('✅ Database seeded successfully!');
}

// Run the seed function
seedDatabase()
  .then(() => {
    console.log('Seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  });
