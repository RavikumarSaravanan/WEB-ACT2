import dotenv from 'dotenv';
import mongoose from 'mongoose';
import mysql from 'mysql2/promise';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
// dbConfig not required for this script

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: new URL('../.env', import.meta.url).pathname });

// Fallback parser: in case .env contains extra markdown/code-fence lines and dotenv misses variables
if (!process.env.DB_TYPE) {
    try {
        const fs = (await import('fs')).default;
        const envRaw = fs.readFileSync(new URL('../.env', import.meta.url)).toString();
        envRaw.split(/\r?\n/).forEach(line => {
            const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/i);
            if (m) {
                process.env[m[1]] = m[2].replace(/^\"|\"$|^'|'$/g, '').trim();
            }
        });
        console.log('Loaded env via fallback parser');
    } catch (e) {
        // ignore fallback errors
    }
}

// Products to add - EDIT THIS ARRAY TO ADD YOUR PRODUCTS
const products = [
    {
        name: "Rice 5kg",
        description: "Premium quality rice",
        category: "Grocery",
        price: 399.00,
        stock: 50,
        image: "rice.jpg"  // Optional: image filename
    },
    {
        name: "Wheat Flour 1kg",
        description: "Fine wheat flour",
        category: "Grocery",
        price: 55.00,
        stock: 100,
        image: "flour.jpg"
    }
    // {
    //     name: "Your Product Name",
    //     description: "Product description",
    //     category: "Category",
    //     price: 99.99,
    //     stock: 10,
    //     image: "image.jpg"  // Optional
    // },
    // Add more products here...

    // Add more products by copying the above format
];

// Function to add products to MongoDB
async function addToMongoDB() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cart_store');
        
        // dynamic import to support ES modules
        const mod = await import('../models/mongodb/productModel.js');
        const createProduct = mod.createProduct ?? (mod.default && mod.default.create ? (p) => mod.default.create(p) : null);
        
        if (!createProduct) {
            console.error('No createProduct function found in product model module');
            return;
        }

        // Clean up duplicates first
        console.log('Checking for duplicate products...');
        for (const product of products) {
            const existing = await mongoose.connection.collection('products').find({ name: product.name }).toArray();
            if (existing.length > 0) {
                console.log(`Found ${existing.length} existing entries for ${product.name}`);
                // Keep only the newest one if there are duplicates
                if (existing.length > 1) {
                    const sorted = existing.sort((a, b) => b.updatedAt - a.updatedAt);
                    const [keep, ...remove] = sorted;
                    console.log(`Keeping newest entry for ${product.name}, removing ${remove.length} duplicates`);
                    await mongoose.connection.collection('products').deleteMany({
                        name: product.name,
                        _id: { $nin: [keep._id] }
                    });
                }
                continue; // Skip adding this product since it exists
            }

            // Add new product
            await createProduct(product);
            console.log(`Added to MongoDB: ${product.name}`);
        }
        
        console.log('\nAll products processed successfully');
        console.log('You can check the products using: node scripts/checkProducts.js');
        await mongoose.connection.close();
    } catch (error) {
        console.error('MongoDB Error:', error);
    }
}

// Function to add products to MySQL
async function addToMySQL() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'cart_store'
        });

        for (const product of products) {
            await connection.execute(
                'INSERT INTO Products (name, description, category, price, stock, image) VALUES (?, ?, ?, ?, ?, ?)',
                [product.name, product.description, product.category, product.price, product.stock, product.image]
            );
            console.log(`Added to MySQL: ${product.name}`);
        }

        console.log('All products added to MySQL successfully');
        await connection.end();
    } catch (error) {
        console.error('MySQL Error:', error);
    }
}

// Check configured database type and run appropriate function
async function main() {
    const dbType = process.env.DB_TYPE || 'mysql';
    console.log(`\n=== Product Seed Script ===`);
    console.log(`Database type: ${dbType.toUpperCase()}`);
    console.log(`Products to process: ${products.length}`);
    console.log('========================\n');
    
    if (dbType === 'mongodb') {
        await addToMongoDB();
    } else {
        await addToMySQL();
    }
}

main().then(() => {
    console.log('\nScript completed. Press Ctrl+C to exit.');
});