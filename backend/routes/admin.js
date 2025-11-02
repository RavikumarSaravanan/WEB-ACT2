import express from 'express';
import { login, logout, getStatus } from '../controllers/authController.js';
import {
  getAllCustomers,
  getAllOrders,
  getDashboardStats,
  exportOrders,
  exportCustomers
} from '../controllers/adminController.js';
import { validateAdminLogin } from '../middleware/validation.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/login', validateAdminLogin, login);
router.get('/status', getStatus);

// Protected admin routes
router.post('/logout', requireAuth, logout);
router.get('/customers', requireAuth, getAllCustomers);
router.get('/orders', requireAuth, getAllOrders);
router.get('/stats', requireAuth, getDashboardStats);
router.get('/export/orders', requireAuth, exportOrders);
router.get('/export/customers', requireAuth, exportCustomers);

export default router;

