import { Router } from 'express';
import {
  getPublicStore,
  listPublicProducts,
  getPublicProduct,
} from '../controllers/publicController.js';
import { createCheckout } from '../controllers/checkoutController.js';

const r = Router();

r.get('/stores/:slug', getPublicStore);
r.get('/stores/:slug/products', listPublicProducts);
r.get('/stores/:slug/products/:id', getPublicProduct);
r.post('/stores/:slug/checkout', createCheckout);

export default r;
