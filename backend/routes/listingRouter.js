import express from 'express';
import auth from '../middleware/auth.js';
import { createListing } from '../controllers/listingController.js';
import upload from '../middleware/upload.js';

const listingRouter = express.Router()
listingRouter.post('/create',auth,upload.array('images', 5),createListing)


export default listingRouter