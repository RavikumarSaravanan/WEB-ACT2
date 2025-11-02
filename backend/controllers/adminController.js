import * as customerService from '../models/dal.js';
import * as orderService from '../models/dal.js';
import * as productService from '../models/dal.js';
import { ApiError } from '../middleware/errorHandler.js';

/**
 * Admin Controller
 * Handles admin-specific operations like viewing customers, orders, and reports
 */

/**
 * Get all customers
 * GET /api/admin/customers
 */
export const getAllCustomers = async (req, res, next) => {
  try {
    const customers = await customerService.getAllCustomers();
    
    res.json({
      success: true,
      message: 'Customers retrieved successfully',
      data: customers
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all orders
 * GET /api/admin/orders
 */
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders();
    
    res.json({
      success: true,
      message: 'Orders retrieved successfully',
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get dashboard statistics
 * GET /api/admin/stats
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const [customers, orders, products] = await Promise.all([
      customerService.getAllCustomers(),
      orderService.getAllOrders(),
      productService.getAllProducts()
    ]);

    // Calculate statistics
    const totalCustomers = customers.length;
    const totalOrders = orders.length;
    const totalProducts = products.length;
    
    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => {
      return sum + (parseFloat(order.total_amount) || 0);
    }, 0);

    // Orders by status
    const ordersByStatus = orders.reduce((acc, order) => {
      const status = order.status || 'pending';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    // Total stock
    const totalStock = products.reduce((sum, product) => {
      return sum + (parseInt(product.stock) || 0);
    }, 0);

    // Recent orders (last 10)
    const recentOrders = orders.slice(0, 10);

    res.json({
      success: true,
      message: 'Dashboard statistics retrieved successfully',
      data: {
        totalCustomers,
        totalOrders,
        totalProducts,
        totalRevenue,
        totalStock,
        ordersByStatus,
        recentOrders
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Export orders to CSV
 * GET /api/admin/export/orders?format=csv
 */
export const exportOrders = async (req, res, next) => {
  try {
    const format = req.query.format || 'csv';
    const orders = await orderService.getAllOrders();

    if (format === 'csv') {
      // CSV header
      let csv = 'Order ID,Customer Name,Email,Phone,Order Date,Status,Total Amount,Items Count\n';
      
      // CSV rows
      orders.forEach(order => {
        const orderId = order.id || order._id;
        const customerName = order.customer_name || order.customer_id?.name || '';
        const email = order.email || order.customer_id?.email || '';
        const phone = order.phone || order.customer_id?.phone || '';
        const orderDate = order.order_date ? new Date(order.order_date).toLocaleDateString() : '';
        const status = order.status || 'pending';
        const totalAmount = order.total_amount || 0;
        const itemsCount = order.item_count || order.items?.length || 0;
        
        csv += `${orderId},"${customerName}","${email}","${phone}",${orderDate},${status},${totalAmount},${itemsCount}\n`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=orders.csv');
      res.send(csv);
    } else {
      throw new ApiError(400, 'Unsupported export format. Use csv');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Export customers to CSV
 * GET /api/admin/export/customers?format=csv
 */
export const exportCustomers = async (req, res, next) => {
  try {
    const format = req.query.format || 'csv';
    const customers = await customerService.getAllCustomers();

    if (format === 'csv') {
      // CSV header
      let csv = 'Customer ID,Name,Email,Phone,Address,Joined Date\n';
      
      // CSV rows
      customers.forEach(customer => {
        const customerId = customer.id || customer._id;
        const name = customer.name || '';
        const email = customer.email || '';
        const phone = customer.phone || '';
        const address = (customer.address || '').replace(/"/g, '""');
        const joinedDate = customer.created_at ? new Date(customer.created_at).toLocaleDateString() : '';
        
        csv += `${customerId},"${name}","${email}","${phone}","${address}",${joinedDate}\n`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=customers.csv');
      res.send(csv);
    } else {
      throw new ApiError(400, 'Unsupported export format. Use csv');
    }
  } catch (error) {
    next(error);
  }
};


