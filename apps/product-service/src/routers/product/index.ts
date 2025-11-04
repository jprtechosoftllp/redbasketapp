import express, { Router } from 'express';
import { createProduct } from '../../controllers/product';

const productRouter:Router = express.Router();

productRouter.post('/create-product', createProduct)

export default productRouter;