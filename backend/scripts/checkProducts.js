import mongoose from 'mongoose';
import 'dotenv/config';

// Fallback for dotenv
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cart_store';

async function checkProducts() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');
        
        // Get the products collection
        const products = await mongoose.connection.collection('products').find({}).toArray();
        console.log('\nProducts in database:');
        console.log(JSON.stringify(products, null, 2));
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

checkProducts();