import { body, validationResult } from 'express-validator';
import { ApiError } from './errorHandler.js';

/**
 * Validation middleware using express-validator
 * Validates request data and returns formatted errors
 */

/**
 * Middleware to check validation results
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg).join(', ');
    throw new ApiError(400, errorMessages);
  }
  next();
};

/**
 * Product validation rules
 */
export const validateProduct = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 2, max: 255 }).withMessage('Product name must be between 2 and 255 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description must be less than 2000 characters'),
  
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  
  body('stock')
    .notEmpty().withMessage('Stock is required')
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  
  body('category')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Category must be less than 100 characters'),
  
  body('image_url')
    .optional()
    .trim()
    .isURL().withMessage('Image URL must be a valid URL'),
  
  validate
];

/**
 * Order validation rules
 */
export const validateOrder = [
  body('customer.name')
    .trim()
    .notEmpty().withMessage('Customer name is required')
    .isLength({ min: 2, max: 255 }).withMessage('Customer name must be between 2 and 255 characters'),
  
  body('customer.email')
    .optional()
    .trim()
    .isEmail().withMessage('Invalid email format'),
  
  body('customer.phone')
    .optional()
    .trim()
    .isLength({ max: 20 }).withMessage('Phone number must be less than 20 characters'),
  
  body('customer.address')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Address must be less than 500 characters'),
  
  body('items')
    .isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  
  body('items.*.product_id')
    .notEmpty().withMessage('Product ID is required for all items'),
  
  body('items.*.quantity')
    .notEmpty().withMessage('Quantity is required for all items')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  
  body('items.*.price_at_purchase')
    .notEmpty().withMessage('Price at purchase is required for all items')
    .isFloat({ min: 0 }).withMessage('Price at purchase must be a positive number'),
  
  body('totalAmount')
    .notEmpty().withMessage('Total amount is required')
    .isFloat({ min: 0 }).withMessage('Total amount must be a positive number'),
  
  validate
];

/**
 * Admin login validation rules
 */
export const validateAdminLogin = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required'),
  
  body('password')
    .trim()
    .notEmpty().withMessage('Password is required'),
  
  validate
];

