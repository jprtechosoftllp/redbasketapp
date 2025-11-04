import express, { Router } from 'express';
import { getAllActiveVendors, getVendorsActive, getVendorsPending, getVendorsRejected } from '../../controllers/vendor';

const vendorRouter:Router = express.Router();

vendorRouter.get('/get-vendors-active', getVendorsActive);
vendorRouter.get('/get-vendors-pending', getVendorsPending);
vendorRouter.get('/get-vendors-rejected', getVendorsRejected);
vendorRouter.get('/get-all-vendors-active', getAllActiveVendors);
export default vendorRouter;