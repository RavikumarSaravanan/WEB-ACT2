import axios from 'axios';

/**
 * API Service
 * Handles all HTTP requests to the backend API
 */

const API_BASE_URL = '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Important for session-based auth
});

/**
 * Product API endpoints
 */
export const productAPI = {
  // Get all products with optional filters
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);

    const response = await api.get(`/products?${params.toString()}`);
    return response.data;
  },

  // Get single product by ID
  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get all categories
  getCategories: async () => {
    const response = await api.get('/products/categories');
    return response.data;
  },

  // Create product (Admin only)
  create: async (productData, imageFile) => {
    const formData = new FormData();
    Object.keys(productData).forEach(key => {
      formData.append(key, productData[key]);
    });
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const response = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Update product (Admin only)
  update: async (id, productData, imageFile) => {
    const formData = new FormData();
    Object.keys(productData).forEach(key => {
      if (productData[key] !== undefined) {
        formData.append(key, productData[key]);
      }
    });
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const response = await api.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Delete product (Admin only)
  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }
};

/**
 * Order API endpoints
 */
export const orderAPI = {
  // Create new order
  create: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Get order by ID
  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  }
};

/**
 * Admin API endpoints
 */
export const adminAPI = {
  // Login
  login: async (username, password) => {
    const response = await api.post('/admin/login', { username, password });
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/admin/logout');
    return response.data;
  },

  // Check authentication status
  getStatus: async () => {
    const response = await api.get('/admin/status');
    return response.data;
  },

  // Get all customers
  getCustomers: async () => {
    const response = await api.get('/admin/customers');
    return response.data;
  },

  // Get all orders
  getOrders: async () => {
    const response = await api.get('/admin/orders');
    return response.data;
  },

  // Get dashboard statistics
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // Export orders
  exportOrders: async (format = 'csv') => {
    const response = await api.get(`/admin/export/orders?format=${format}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Export customers
  exportCustomers: async (format = 'csv') => {
    const response = await api.get(`/admin/export/customers?format=${format}`, {
      responseType: 'blob'
    });
    return response.data;
  }
};

/**
 * Payment API endpoints
 */
export const paymentAPI = {
  // Create Razorpay order
  createOrder: async (amount, receipt, notes = {}) => {
    const response = await api.post('/payments/create-order', {
      amount,
      currency: 'INR',
      receipt,
      notes
    });
    return response.data;
  },

  // Verify payment
  verifyPayment: async (orderId, paymentId, signature) => {
    const response = await api.post('/payments/verify', {
      orderId,
      paymentId,
      signature
    });
    return response.data;
  }
};

export default api;

