import express from 'express';
import auth from '../middleware/auth.js';
import { createListing, getAllListings, getListingById } from '../controllers/listingController.js';
import upload from '../middleware/upload.js';
import Listing from '../model/Listing.js';

const listingRouter = express.Router()

listingRouter.post('/create',auth,upload.array('images', 5),createListing)
listingRouter.get('/all',auth, getAllListings)
listingRouter.get('/getById/:id',auth,getListingById)

export default listingRouter