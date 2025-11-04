import express from 'express'
import { getManagersActive, getManagersArchived } from '../../controllers/manager';

const manageRouter = express.Router();

manageRouter.get('/get-managers-active', getManagersActive);
manageRouter.get('/get-managers-archived', getManagersArchived)

export default manageRouter;