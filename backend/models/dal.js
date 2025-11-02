import { DB_TYPE } from '../config/database.js';

/**
 * Data Access Layer (DAL)
 * Abstracts database operations to allow easy switching between MySQL and MongoDB
 * 
 * This layer routes all database calls to the appropriate implementation
 * based on the DB_TYPE configuration.
 */

// Import MySQL models
import * as mysqlProductModel from './mysql/productModel.js';
import * as mysqlCustomerModel from './mysql/customerModel.js';
import * as mysqlOrderModel from './mysql/orderModel.js';

// Import MongoDB models
import * as mongodbProductModel from './mongodb/productModel.js';
import * as mongodbCustomerModel from './mongodb/customerModel.js';
import * as mongodbOrderModel from './mongodb/orderModel.js';

// Select models based on DB_TYPE
const ProductModel = DB_TYPE === 'mysql' ? mysqlProductModel : mongodbProductModel;
const CustomerModel = DB_TYPE === 'mysql' ? mysqlCustomerModel : mongodbCustomerModel;
const OrderModel = DB_TYPE === 'mysql' ? mysqlOrderModel : mongodbOrderModel;

/**
 * Product operations
 */
export const getAllProducts = ProductModel.getAllProducts;
export const getProductById = ProductModel.getProductById;
export const createProduct = ProductModel.createProduct;
export const updateProduct = ProductModel.updateProduct;
export const deleteProduct = ProductModel.deleteProduct;
export const getCategories = ProductModel.getCategories;

/**
 * Customer operations
 */
export const createCustomer = CustomerModel.createCustomer;
export const getCustomerById = CustomerModel.getCustomerById;
export const getAllCustomers = CustomerModel.getAllCustomers;

/**
 * Order operations
 */
export const createOrder = OrderModel.createOrder;
export const getOrderById = OrderModel.getOrderById;
export const getAllOrders = OrderModel.getAllOrders;

/**
 * Database type getter (for logging/debugging)
 */
export const getDatabaseType = () => DB_TYPE;

