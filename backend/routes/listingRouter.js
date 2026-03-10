import express from 'express';
import auth from '../middleware/auth.js';
import { createListing, deleteListingById, getAllListings, getListingById, getListingsByUserId, likeListing, saveListing, searchListings, updateListingById} from '../controllers/listingController.js';
import upload from '../middleware/upload.js';


const listingRouter = express.Router()

listingRouter.post('/create',auth,upload.array('images', 5),createListing)
listingRouter.get('/all', getAllListings)
listingRouter.get('/getById/:id',getListingById)
listingRouter.put('/updateListingById/:id',auth,upload.array('images', 5),updateListingById)
listingRouter.delete('/deleteListingById/:id',auth,deleteListingById)
listingRouter.get('/getListingByUserId',auth,getListingsByUserId)
listingRouter.post('/like/:id',auth,likeListing)
listingRouter.post('/save/:id',auth,saveListing)
listingRouter.get('/search',searchListings)


export default listingRouter