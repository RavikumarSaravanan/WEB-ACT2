import { getDatabase } from '../../config/database.js';

/**
 * MySQL Product Model
 * Handles all database operations for products using MySQL
 */

/**
 * Get all products with optional search and filter
 * @param {Object} filters - Filter options (category, search term)
 * @returns {Promise<Array>} Array of products
 */
export const getAllProducts = async (filters = {}) => {
  const db = getDatabase();
  let query = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  // Filter by category
  if (filters.category) {
    query += ' AND category = ?';
    params.push(filters.category);
  }

  // Search by name
  if (filters.search) {
    query += ' AND (name LIKE ? OR description LIKE ?)';
    const searchTerm = `%${filters.search}%`;
    params.push(searchTerm, searchTerm);
  }

  query += ' ORDER BY created_at DESC';

  const [rows] = await db.execute(query, params);
  return rows;
};

/**
 * Get a single product by ID
 * @param {number|string} id - Product ID
 * @returns {Promise<Object|null>} Product object or null if not found
 */
export const getProductById = async (id) => {
  try {
    const db = getDatabase();
    const productId = parseInt(id);
    if (isNaN(productId)) {
      return null;
    }
    const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [productId]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Error getting product by ID:', error);
    return null;
  }
};

/**
 * Create a new product
 * @param {Object} productData - Product data (name, description, price, stock, category, image_path)
 * @returns {Promise<Object>} Created product with ID
 */
export const createProduct = async (productData) => {
  const db = getDatabase();
  const { name, description, price, stock, category, image_path } = productData;
  
  const [result] = await db.execute(
    'INSERT INTO products (name, description, price, stock, category, image_path) VALUES (?, ?, ?, ?, ?, ?)',
    [name, description, price, stock, category || null, image_path || null]
  );

  return getProductById(result.insertId);
};

/**
 * Update a product by ID
 * @param {number} id - Product ID
 * @param {Object} productData - Updated product data
 * @returns {Promise<Object|null>} Updated product or null if not found
 */
export const updateProduct = async (id, productData) => {
  const db = getDatabase();
  const { name, description, price, stock, category, image_path } = productData;
  
  const fields = [];
  const values = [];

  if (name !== undefined) {
    fields.push('name = ?');
    values.push(name);
  }
  if (description !== undefined) {
    fields.push('description = ?');
    values.push(description);
  }
  if (price !== undefined) {
    fields.push('price = ?');
    values.push(price);
  }
  if (stock !== undefined) {
    fields.push('stock = ?');
    values.push(stock);
  }
  if (category !== undefined) {
    fields.push('category = ?');
    values.push(category);
  }
  if (image_path !== undefined) {
    fields.push('image_path = ?');
    values.push(image_path);
  }

  if (fields.length === 0) {
    return getProductById(id);
  }

  values.push(id);
  const query = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;

  await db.execute(query, values);
  return getProductById(id);
};

/**
 * Delete a product by ID
 * @param {number|string} id - Product ID
 * @returns {Promise<boolean>} True if deleted, false if not found
 */
export const deleteProduct = async (id) => {
  try {
    const db = getDatabase();
    // Ensure ID is a valid integer for MySQL
    const productId = parseInt(id);
    if (isNaN(productId)) {
      return false;
    }
    const [result] = await db.execute('DELETE FROM products WHERE id = ?', [productId]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};

/**
 * Get all unique categories
 * @returns {Promise<Array>} Array of category strings
 */
export const getCategories = async () => {
  const db = getDatabase();
  const [rows] = await db.execute('SELECT DISTINCT category FROM products WHERE category IS NOT NULL ORDER BY category');
  return rows.map(row => row.category);
};

