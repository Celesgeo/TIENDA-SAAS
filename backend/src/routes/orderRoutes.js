import { Router } from 'express';
import { listOrders, getOrder, updateOrderStatus } from '../controllers/orderController.js';
import { requireAuth } from '../middleware/auth.js';
import { loadStore } from '../middleware/tenant.js';

const r = Router();

r.use(requireAuth, loadStore);

r.get('/', listOrders);
r.get('/:id', getOrder);
r.patch('/:id/status', updateOrderStatus);

export default r;
