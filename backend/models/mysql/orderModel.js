import { getDatabase, DB_TYPE } from '../../config/database.js';
import { createCustomer } from './customerModel.js';

/**
 * MySQL Order Model
 * Handles all database operations for orders using MySQL
 */

/**
 * Create a new order with customer and order items
 * @param {Object} orderData - Order data including customer info and items
 * @returns {Promise<Object>} Created order with full details
 */
export const createOrder = async (orderData) => {
  if (DB_TYPE !== 'mysql') {
    throw new Error('This function is for MySQL only. Use MongoDB orderModel for MongoDB.');
  }
  
  const db = getDatabase();
  const { customer, items, totalAmount, payment } = orderData;
  
  // Set order status based on payment
  const orderStatus = payment && payment.verified ? 'confirmed' : 'pending';

  // Start transaction
  await db.beginTransaction();

  try {
    // Create customer
    const customerRecord = await createCustomer(customer);
    const customerId = customerRecord.id;

    // Create order with payment info
    const paymentInfo = payment ? JSON.stringify({
      orderId: payment.orderId,
      paymentId: payment.paymentId,
      verified: payment.verified
    }) : null;
    
    const [orderResult] = await db.execute(
      'INSERT INTO orders (customer_id, status, total_amount, payment_info) VALUES (?, ?, ?, ?)',
      [customerId, orderStatus, totalAmount, paymentInfo]
    );
    const orderId = orderResult.insertId;

    // Create order items
    for (const item of items) {
      await db.execute(
        'INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price_at_purchase]
      );

      // Update product stock
      await db.execute(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    // Commit transaction
    await db.commit();

    // Return full order details
    return getOrderById(orderId);
  } catch (error) {
    // Rollback transaction on error
    await db.rollback();
    throw error;
  }
};

/**
 * Get order by ID with customer and items
 * @param {number} id - Order ID
 * @returns {Promise<Object|null>} Order object with customer and items or null if not found
 */
export const getOrderById = async (id) => {
  const db = getDatabase();

  // Get order with customer
  const [orderRows] = await db.execute(
    `SELECT o.*, c.name as customer_name, c.email, c.phone, c.address 
     FROM orders o 
     JOIN customers c ON o.customer_id = c.id 
     WHERE o.id = ?`,
    [id]
  );

  if (orderRows.length === 0) {
    return null;
  }

  const order = orderRows[0];

  // Get order items with product details
  const [itemRows] = await db.execute(
    `SELECT oi.*, p.name as product_name, p.image_path 
     FROM order_items oi 
     JOIN products p ON oi.product_id = p.id 
     WHERE oi.order_id = ?`,
    [id]
  );

  return {
    ...order,
    items: itemRows
  };
};

/**
 * Get all orders with customer information
 * @returns {Promise<Array>} Array of all orders
 */
export const getAllOrders = async () => {
  const db = getDatabase();
  
  const [orderRows] = await db.execute(
    `SELECT o.*, c.name as customer_name, c.email, c.phone, c.address 
     FROM orders o 
     JOIN customers c ON o.customer_id = c.id 
     ORDER BY o.order_date DESC`
  );

  // For each order, get order items count
  const orders = await Promise.all(
    orderRows.map(async (order) => {
      const [itemRows] = await db.execute(
        'SELECT COUNT(*) as item_count, SUM(quantity) as total_items FROM order_items WHERE order_id = ?',
        [order.id]
      );
      return {
        ...order,
        item_count: itemRows[0].item_count || 0,
        total_items: itemRows[0].total_items || 0
      };
    })
  );

  return orders;
};

