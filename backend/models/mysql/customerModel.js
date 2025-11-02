import { getDatabase } from '../../config/database.js';

/**
 * MySQL Customer Model
 * Handles all database operations for customers using MySQL
 */

/**
 * Create a new customer
 * @param {Object} customerData - Customer data (name, email, phone, address)
 * @returns {Promise<Object>} Created customer with ID
 */
export const createCustomer = async (customerData) => {
  const db = getDatabase();
  const { name, email, phone, address } = customerData;
  
  const [result] = await db.execute(
    'INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)',
    [name, email || null, phone || null, address || null]
  );

  const [rows] = await db.execute('SELECT * FROM customers WHERE id = ?', [result.insertId]);
  return rows[0];
};

/**
 * Get customer by ID
 * @param {number} id - Customer ID
 * @returns {Promise<Object|null>} Customer object or null if not found
 */
export const getCustomerById = async (id) => {
  const db = getDatabase();
  const [rows] = await db.execute('SELECT * FROM customers WHERE id = ?', [id]);
  return rows.length > 0 ? rows[0] : null;
};

/**
 * Get all customers
 * @returns {Promise<Array>} Array of all customers
 */
export const getAllCustomers = async () => {
  const db = getDatabase();
  const [rows] = await db.execute('SELECT * FROM customers ORDER BY created_at DESC');
  return rows;
};

