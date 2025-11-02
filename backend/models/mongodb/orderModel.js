import mongoose from 'mongoose';
import { createCustomer } from './customerModel.js';

/**
 * MongoDB Order Model
 * Handles all database operations for orders using MongoDB/Mongoose
 */

// Order Item Schema (embedded in Order)
const orderItemSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price_at_purchase: {
    type: Number,
    required: true,
    min: 0
  }
});

// Order Schema
const orderSchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  order_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    index: true
  },
  total_amount: {
    type: Number,
    required: true,
    min: 0
  },
  items: [orderItemSchema],
  payment: {
    orderId: String,
    paymentId: String,
    signature: String,
    verified: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Create model
const Order = mongoose.model('Order', orderSchema);

/**
 * Create a new order with customer and order items
 * @param {Object} orderData - Order data including customer info and items
 * @returns {Promise<Object>} Created order with full details
 */
export const createOrder = async (orderData) => {
  const { customer, items, totalAmount, payment } = orderData;
  
  // Set order status based on payment
  const orderStatus = payment && payment.verified ? 'confirmed' : 'pending';

  // Create customer
  const customerRecord = await createCustomer(customer);
  const customerId = customerRecord._id;

  // Update product stock (using Product model)
  const Product = mongoose.model('Product');
  for (const item of items) {
    await Product.findByIdAndUpdate(item.product_id, {
      $inc: { stock: -item.quantity }
    });
  }

  // Create order
  const order = new Order({
    customer_id: customerId,
    status: orderStatus,
    total_amount: totalAmount,
    items: items,
    payment: payment || null
  });

  const savedOrder = await order.save();
  return getOrderById(savedOrder._id);
};

/**
 * Get order by ID with customer and items
 * @param {string} id - Order ID
 * @returns {Promise<Object|null>} Order object with customer and items or null if not found
 */
export const getOrderById = async (id) => {
  const order = await Order.findById(id)
    .populate('customer_id', 'name email phone address')
    .populate('items.product_id', 'name image_path');
  
  if (order) {
    const orderObj = order.toObject();
    orderObj.id = orderObj._id.toString();
    if (orderObj.customer_id) {
      orderObj.customer_id.id = orderObj.customer_id._id.toString();
    }
    return orderObj;
  }
  return null;
};

/**
 * Get all orders with customer information
 * @returns {Promise<Array>} Array of all orders
 */
export const getAllOrders = async () => {
  const orders = await Order.find()
    .populate('customer_id', 'name email phone address')
    .sort({ order_date: -1 });
  
  return orders.map(order => {
    const orderObj = order.toObject();
    orderObj.id = orderObj._id.toString();
    orderObj.item_count = orderObj.items ? orderObj.items.length : 0;
    orderObj.total_items = orderObj.items ? orderObj.items.reduce((sum, item) => sum + (item.quantity || 0), 0) : 0;
    if (orderObj.customer_id) {
      orderObj.customer_id.id = orderObj.customer_id._id.toString();
      orderObj.customer_name = orderObj.customer_id.name;
      orderObj.email = orderObj.customer_id.email;
      orderObj.phone = orderObj.customer_id.phone;
      orderObj.address = orderObj.customer_id.address;
    }
    return orderObj;
  });
};

