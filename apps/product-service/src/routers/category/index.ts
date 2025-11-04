import { isAuthenticatedAdmin } from '@packages/backend/middlewares/auth';
import express, { Router } from 'express';
import { activeCategory, categoryDelete, createCategory, getCategory, updateCategory } from '../../controllers/category';

const categoryRouter:Router = express.Router()

categoryRouter.post('/create-category', isAuthenticatedAdmin, createCategory);
categoryRouter.post('/update-category', isAuthenticatedAdmin, updateCategory);
categoryRouter.get('/get-category', getCategory);
categoryRouter.delete('/delete-category', isAuthenticatedAdmin, categoryDelete);
categoryRouter.get('/active-category', activeCategory);

export default categoryRouter;