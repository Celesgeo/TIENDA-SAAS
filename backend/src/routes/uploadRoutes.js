import { Router } from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/uploadController.js';
import { requireAuth } from '../middleware/auth.js';
import { loadStore } from '../middleware/tenant.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});

const r = Router();

r.post('/', requireAuth, loadStore, upload.single('image'), uploadImage);

export default r;
