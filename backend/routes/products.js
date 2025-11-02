import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories
} from '../controllers/productController.js';
import { requireAuth } from '../middleware/auth.js';
import { validateProduct } from '../middleware/validation.js';
import { uploadSingle, handleUploadError } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);

// Admin routes (require authentication)
router.post('/', requireAuth, uploadSingle, handleUploadError, validateProduct, createProduct);
router.put('/:id', requireAuth, uploadSingle, handleUploadError, validateProduct, updateProduct);
router.delete('/:id', requireAuth, deleteProduct);

export default router;

