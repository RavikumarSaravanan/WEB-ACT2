import * as productService from '../models/dal.js';
import { ApiError } from '../middleware/errorHandler.js';

/**
 * Product Controller
 * Handles HTTP requests for product operations
 */

/**
 * Get all products with optional filtering
 * GET /api/products?category=Food&search=rice
 */
export const getAllProducts = async (req, res, next) => {
  try {
    const filters = {
      category: req.query.category || null,
      search: req.query.search || null
    };

    const products = await productService.getAllProducts(filters);
    
    res.json({
      success: true,
      message: 'Products retrieved successfully',
      data: products
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single product by ID
 * GET /api/products/:id
 */
export const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    res.json({
      success: true,
      message: 'Product retrieved successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new product (Admin only)
 * POST /api/products
 */
export const createProduct = async (req, res, next) => {
  try {
    // Handle image - either uploaded file or external URL
    let image_path = null;
    if (req.file) {
      // Uploaded file
      image_path = `/uploads/${req.file.filename}`;
    } else if (req.body.image_url && req.body.image_url.trim()) {
      // External image URL
      image_path = req.body.image_url.trim();
    }

    const productData = {
      name: req.body.name,
      description: req.body.description || '',
      price: parseFloat(req.body.price),
      stock: parseInt(req.body.stock),
      category: req.body.category || null,
      image_path: image_path
    };

    const product = await productService.createProduct(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update product (Admin only)
 * PUT /api/products/:id
 */
export const updateProduct = async (req, res, next) => {
  try {
    // Handle image - either uploaded file or external URL
    let image_path = undefined;
    if (req.file) {
      // Uploaded file
      image_path = `/uploads/${req.file.filename}`;
    } else if (req.body.image_url && req.body.image_url.trim()) {
      // External image URL
      image_path = req.body.image_url.trim();
    }

    const productData = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price ? parseFloat(req.body.price) : undefined,
      stock: req.body.stock ? parseInt(req.body.stock) : undefined,
      category: req.body.category,
      image_path: image_path
    };

    // Remove undefined values
    Object.keys(productData).forEach(key => 
      productData[key] === undefined && delete productData[key]
    );

    const product = await productService.updateProduct(req.params.id, productData);

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete product (Admin only)
 * DELETE /api/products/:id
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const deleted = await productService.deleteProduct(req.params.id);

    if (!deleted) {
      throw new ApiError(404, 'Product not found');
    }

    res.json({
      success: true,
      message: 'Product deleted successfully',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all categories
 * GET /api/products/categories
 */
export const getCategories = async (req, res, next) => {
  try {
    const categories = await productService.getCategories();

    res.json({
      success: true,
      message: 'Categories retrieved successfully',
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

