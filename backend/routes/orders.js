import express from 'express';
import {
  createOrder,
  getOrderById
} from '../controllers/orderController.js';
import { validateOrder } from '../middleware/validation.js';

const router = express.Router();

router.post('/', validateOrder, createOrder);
router.get('/:id', getOrderById);

export default router;

