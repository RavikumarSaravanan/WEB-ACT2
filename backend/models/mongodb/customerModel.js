import mongoose from 'mongoose';

/**
 * MongoDB Customer Model
 * Handles all database operations for customers using MongoDB/Mongoose
 */

// Customer Schema
const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    index: true
  },
  phone: {
    type: String,
    index: true
  },
  address: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Create model
const Customer = mongoose.model('Customer', customerSchema);

/**
 * Create a new customer
 * @param {Object} customerData - Customer data (name, email, phone, address)
 * @returns {Promise<Object>} Created customer
 */
export const createCustomer = async (customerData) => {
  const customer = new Customer(customerData);
  return await customer.save();
};

/**
 * Get customer by ID
 * @param {string} id - Customer ID
 * @returns {Promise<Object|null>} Customer object or null if not found
 */
export const getCustomerById = async (id) => {
  const customer = await Customer.findById(id);
  if (customer) {
    const customerObj = customer.toObject();
    customerObj.id = customerObj._id.toString();
    return customerObj;
  }
  return null;
};

/**
 * Get all customers
 * @returns {Promise<Array>} Array of all customers
 */
export const getAllCustomers = async () => {
  const customers = await Customer.find().sort({ createdAt: -1 });
  return customers.map(customer => ({
    ...customer.toObject(),
    id: customer._id.toString()
  }));
};
