import { Router } from 'express';
import { mercadoPagoWebhook } from '../controllers/checkoutController.js';

const r = Router();

r.post('/mercadopago', mercadoPagoWebhook);
r.get('/mercadopago', mercadoPagoWebhook);

export default r;
