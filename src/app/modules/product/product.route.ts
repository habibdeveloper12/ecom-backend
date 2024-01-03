import express from 'express';
import { ProductController } from './product.controller';
const router = express.Router();

router.post('/create-order', ProductController.createOrder);
router.post('/payment-intent', ProductController.createPayment);

export const ProductRoutes = router;
