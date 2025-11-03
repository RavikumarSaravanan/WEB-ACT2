import { connectDatabase, getDatabase, DB_TYPE } from '../config/database.js';
import * as productService from '../models/dal.js';

/**
 * Seed sample products into the database
 * Run this script to populate the database with initial products
 */

const sampleProducts = [
  {
    name: 'Rice 5kg',
    description: 'Premium quality rice, 5kg bag',
    price: 450.00,
    stock: 50,
    category: 'Food',
    image_path: "../img/rice.webp"
  },
  {
    name: 'Wheat Flour 2kg',
    description: 'Fresh wheat flour, 2kg pack',
    price: 120.00,
    stock: 30,
    category: 'Food',
    image_path: null
  },
  {
    name: 'Cooking Oil 1L',
    description: 'Refined cooking oil, 1 liter',
    price: 180.00,
    stock: 40,
    category: 'Food',
    image_path: null
  },
  {
    name: 'Soap Bar',
    description: 'Gentle soap bar for daily use',
    price: 25.00,
    stock: 100,
    category: 'Personal Care',
    image_path: null
  },
  {
    name: 'Toothpaste',
    description: 'Fluoride toothpaste, 100g',
    price: 55.00,
    stock: 60,
    category: 'Personal Care',
    image_path: null
  },
  {
    name: 'Detergent Powder 1kg',
    description: 'Laundry detergent, 1kg pack',
    price: 150.00,
    stock: 35,
    category: 'Household',
    image_path: null
  },
  {
    name: 'Notebook A4',
    description: 'Spiral bound notebook, A4 size',
    price: 45.00,
    stock: 80,
    category: 'Stationery',
    image_path: null
  },
  {
    name: 'Pen Set',
    description: 'Set of 3 blue ink pens',
    price: 30.00,
    stock: 120,
    category: 'Stationery',
    image_path: null
  }
];

const seedProducts = async () => {
  try {
    console.log('🌱 Starting product seeding...');
    
    // Connect to database
    await connectDatabase();
    console.log(`✅ Connected to ${DB_TYPE} database`);
    
    // Check if products already exist
    const existingProducts = await productService.getAllProducts();
    
    if (existingProducts.length > 0) {
      console.log(`⚠️  Database already has ${existingProducts.length} products.`);
      console.log('   To re-seed, please clear the products table first.');
      process.exit(0);
    }
    
    // Insert sample products
    console.log(`📦 Inserting ${sampleProducts.length} sample products...`);
    
    for (const product of sampleProducts) {
      await productService.createProduct(product);
      console.log(`   ✓ Added: ${product.name}`);
    }
    
    console.log(`\n✅ Successfully seeded ${sampleProducts.length} products!`);
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
};

// Run the seeding
seedProducts();

