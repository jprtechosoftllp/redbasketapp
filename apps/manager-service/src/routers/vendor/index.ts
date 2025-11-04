import express from 'express';
import { getVendor } from '../../controllers/vendor';

const vendorRouter = express.Router();

vendorRouter.get('/get-vendors', getVendor)


export default vendorRouter;