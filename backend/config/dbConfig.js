import dotenv from 'dotenv';
dotenv.config();

/**
 * Database Configuration
 * Switches between MySQL and MongoDB based on DB_TYPE environment variable
 * 
 * To switch databases:
 * - Set DB_TYPE=mysql in .env for MySQL
 * - Set DB_TYPE=mongodb in .env for MongoDB
 * - Comment/uncomment the database-specific connection code below as needed
 */

const DB_TYPE = process.env.DB_TYPE || 'mysql';

// MySQL Connection Configuration
export const mysqlConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cart_store',
  port: parseInt(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// MongoDB Connection Configuration
export const mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/cart_store';

export { DB_TYPE };

