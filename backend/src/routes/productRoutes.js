import { Router } from 'express';
import {
  listProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { requireAuth } from '../middleware/auth.js';
import { loadStore } from '../middleware/tenant.js';

const r = Router();

r.use(requireAuth, loadStore);

r.get('/', listProducts);
r.post('/', createProduct);
r.get('/:id', getProduct);
r.patch('/:id', updateProduct);
r.delete('/:id', deleteProduct);

export default r;
