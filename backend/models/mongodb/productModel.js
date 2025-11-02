import mongoose from 'mongoose';

// Import mongoose for ObjectId validation
const { Types } = mongoose;

/**
 * MongoDB Product Model
 * Handles all database operations for products using MongoDB/Mongoose
 */

// Product Schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  description: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    index: true
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  category: {
    type: String,
    index: true
  },
  image_path: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Create model
const Product = mongoose.model('Product', productSchema);

/**
 * Get all products with optional search and filter
 * @param {Object} filters - Filter options (category, search term)
 * @returns {Promise<Array>} Array of products
 */
export const getAllProducts = async (filters = {}) => {
  const query = {};

  // Filter by category
  if (filters.category) {
    query.category = filters.category;
  }

  // Search by name or description
  if (filters.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: 'i' } },
      { description: { $regex: filters.search, $options: 'i' } }
    ];
  }

  const products = await Product.find(query).sort({ createdAt: -1 });
  // Convert _id to id for consistency with MySQL format
  return products.map(product => ({
    ...product.toObject(),
    id: product._id.toString()
  }));
};

/**
 * Get a single product by ID
 * @param {string} id - Product ID
 * @returns {Promise<Object|null>} Product object or null if not found
 */
export const getProductById = async (id) => {
  try {
    // Validate ObjectId format for MongoDB
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const product = await Product.findById(id);
    // Convert _id to id for consistency
    if (product) {
      const productObj = product.toObject();
      productObj.id = productObj._id.toString();
      return productObj;
    }
    return null;
  } catch (error) {
    console.error('Error getting product by ID:', error);
    return null;
  }
};

/**
 * Create a new product
 * @param {Object} productData - Product data (name, description, price, stock, category, image_path)
 * @returns {Promise<Object>} Created product
 */
export const createProduct = async (productData) => {
  try {
    const product = new Product(productData);
    const savedProduct = await product.save();
    // Convert _id to id for consistency
    const productObj = savedProduct.toObject();
    productObj.id = productObj._id.toString();
    return productObj;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

/**
 * Update a product by ID
 * @param {string} id - Product ID
 * @param {Object} productData - Updated product data
 * @returns {Promise<Object|null>} Updated product or null if not found
 */
export const updateProduct = async (id, productData) => {
  try {
    // Validate ObjectId format for MongoDB
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const product = await Product.findByIdAndUpdate(id, productData, { new: true, runValidators: true });
    // Convert _id to id for consistency
    if (product) {
      const productObj = product.toObject();
      productObj.id = productObj._id.toString();
      return productObj;
    }
    return null;
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
};

/**
 * Delete a product by ID
 * @param {string} id - Product ID
 * @returns {Promise<boolean>} True if deleted, false if not found
 */
export const deleteProduct = async (id) => {
  try {
    // Validate ObjectId format for MongoDB
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }
    const result = await Product.findByIdAndDelete(id);
    return result !== null;
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
  return await Product.distinct('category').then(categories => 
    categories.filter(cat => cat !== null && cat !== '')
  );
};

