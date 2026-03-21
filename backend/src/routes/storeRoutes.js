import { Router } from 'express';
import {
  getMyStore,
  updateMyStore,
  publishStore,
  unpublishStore,
  suggestSlug,
} from '../controllers/storeController.js';
import { requireAuth } from '../middleware/auth.js';
import { loadStore } from '../middleware/tenant.js';

const r = Router();

r.use(requireAuth, loadStore);

r.get('/', getMyStore);
r.patch('/', updateMyStore);
r.post('/publish', publishStore);
r.post('/unpublish', unpublishStore);
r.get('/suggest-slug', suggestSlug);

export default r;
