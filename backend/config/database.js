import { DB_TYPE, mysqlConfig, mongodbUri } from './dbConfig.js';

/**
 * Database Connection Abstraction
 * Handles connection to either MySQL or MongoDB based on configuration
 */

let dbConnection = null;
let mysqlModule = null;
let mongooseModule = null;

/**
 * Initialize database connection based on DB_TYPE
 */
export const connectDatabase = async () => {
  try {
    if (DB_TYPE === 'mysql') {
      // MySQL Connection - dynamic import to allow MongoDB usage without MySQL installed
      mysqlModule = await import('mysql2/promise');
      dbConnection = await mysqlModule.createConnection(mysqlConfig);
      await dbConnection.execute('SELECT 1');
      console.log('✅ MySQL database connected successfully');
    } else if (DB_TYPE === 'mongodb') {
      // MongoDB Connection - dynamic import to allow MySQL usage without Mongoose installed
      mongooseModule = await import('mongoose');
      await mongooseModule.default.connect(mongodbUri);
      dbConnection = mongooseModule.default.connection;
      console.log('✅ MongoDB database connected successfully');
    } else {
      throw new Error(`Invalid DB_TYPE: ${DB_TYPE}. Must be 'mysql' or 'mongodb'`);
    }
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    throw error;
  }
};

/**
 * Get database connection
 */
export const getDatabase = () => {
  if (!dbConnection) {
    throw new Error('Database not initialized. Call connectDatabase() first.');
  }
  return dbConnection;
};

/**
 * Close database connection
 */
export const closeDatabase = async () => {
  try {
    if (DB_TYPE === 'mysql' && dbConnection) {
      await dbConnection.end();
      console.log('MySQL connection closed');
    } else if (DB_TYPE === 'mongodb' && dbConnection && mongooseModule) {
      await mongooseModule.default.connection.close();
      console.log('MongoDB connection closed');
    }
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
};

export { DB_TYPE };

