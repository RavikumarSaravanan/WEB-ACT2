import * as orderService from '../models/dal.js';
import { ApiError } from '../middleware/errorHandler.js';

/**
 * Order Controller
 * Handles HTTP requests for order operations
 */

/**
 * Create new order
 * POST /api/orders
 */
export const createOrder = async (req, res, next) => {
  try {
    const { customer, items, totalAmount, payment } = req.body;

    // Validate customer data
    if (!customer || !customer.name) {
      throw new ApiError(400, 'Customer name is required');
    }

    // Validate that all required items are present
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new ApiError(400, 'Order must contain at least one item');
    }

    // Validate total amount
    if (!totalAmount || totalAmount <= 0) {
      throw new ApiError(400, 'Total amount must be greater than 0');
    }

    // Verify stock availability for each item
    const productService = await import('../models/dal.js');
    for (const item of items) {
      if (!item.product_id) {
        throw new ApiError(400, 'Product ID is required for all items');
      }
      
      const product = await productService.getProductById(item.product_id);
      if (!product) {
        throw new ApiError(404, `Product with ID ${item.product_id} not found`);
      }
      
      const currentStock = product.stock || 0;
      const requestedQuantity = item.quantity || 0;
      
      if (requestedQuantity <= 0) {
        throw new ApiError(400, `Invalid quantity for product ${product.name}`);
      }
      
      if (currentStock < requestedQuantity) {
        throw new ApiError(400, `Insufficient stock for product ${product.name}. Available: ${currentStock}, Requested: ${requestedQuantity}`);
      }
    }

    const order = await orderService.createOrder({
      customer,
      items,
      totalAmount: parseFloat(totalAmount),
      payment: payment || null
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get order by ID
 * GET /api/orders/:id
 */
export const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id);

    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    res.json({
      success: true,
      message: 'Order retrieved successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

