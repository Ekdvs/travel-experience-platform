import { request } from "express";
import upload from "../middleware/upload.js";
import Listing from "../model/Listing.js";

//create listing
export const createListing = async (request,response)=>{
    try {
        const { title, location, description, price, } = request.body;
        const userId = request.userId;
        
        // Validate required fields
        if (!title || !location || !description || !price || !request.files || request.files.length === 0) {
            return response.status(400).json(
                {   
                    message: "All fields are required",
                    error: true,
                    success: false
                }
            );
        }

        if(!userId){
            return response.status(401).json(
                { 
                    message: "Unauthorized, user not found", 
                    error: true,
                    success: false 
                }
            );
        }

        // Multer + Cloudinary already uploads files
        const imageUrls = request.files.map((file) => file.path); // this is the Cloudinary URL

        // Create new listing
        const newListing = new Listing({
            title,
            location,
            description,
            price,
            image: imageUrls,
            creator: userId
        });

        await newListing.save();

        return response.status(201).json(
            { 
                message: "Listing created successfully", 
                error: false,
                success: true,
                data: { listing: newListing }
            }
        );



    } catch (error) {
        console.log(error.message)
        response.status(500).json(
            { 
                message: "Error creating listing", 
                error: true,
                success: false 
            }
        );
    }
}

//get all listings
export const getAllListings = async (request,response)=>{
    try {
        const page= parseInt(request.query.page) || 1;
        const limit = parseInt(request.query.limit) || 10;
        const skip = (page - 1) * limit;

        //get total count of listings
        const total = await Listing.countDocuments();

        //total pages
        const totalPages = Math.ceil(total / limit);

        //fetch listing all
        const listings = await Listing.find().sort({ createdAt: -1 }).skip(skip).limit(limit).populate("creator","name ");
        
        response.status(200).json(
            { 
                message: "Listings fetched successfully", 
                error: false,
                success: true,
                data: { 
                    listings, 
                    pagination: {
                        total,
                        page,
                        limit,
                        totalPages,
                        hasNextPage: page < totalPages,
                        hasPrevPage: page > 1
                    } 
                }
            }
        );
    } catch (error) {
        console.log("error", error.message);
        response.status(500).json(
            { 
                message: "Error fetching listings", 
                error: true,
                success: false 
            }
        );
    }
}

//get listing by id
export const getListingById = async(request,response)=>{
    try {
        const listingId = request.params.id;

        if(!listingId){
            return response.status(400).json(
                { 
                    message: "Listing id is required", 
                    error: true,
                    success: false 
                }
            );
        }

        const listing = await Listing.findById(listingId).populate("creator","name"); 
        if(!listing){
            return response.status(404).json(
                { 
                    message: "Listing not found", 
                    error: true,
                    success: false 
                }
            );
        }
        response.status(200).json(
            { 
                message: "Listing fetched successfully", 
                error: false,
                success: true,
                data: listing
            }
        );  
        
    } catch (error) {
        console.log(error.message)
        response.status(500).json(
            { 
                message: "Error fetching listing", 
                error: true,
                success: false 
            }
        );
        
    }
}

//update listing by Owner
export const updateListingById = async (request, response) => {
  try {
    const listingId = request.params.id;
    const userId = request.userId;
    const { title, location, description, price } = request.body;

    if (!listingId) {
      return response.status(400).json({
        message: "Listing id is required",
        error: true,
        success: false
      });
    }

    if (!userId) {
      return response.status(401).json({
        message: "Unauthorized, user not found",
        error: true,
        success: false
      });
    }

    // Find listing
    const listing = await Listing.findById(listingId);

    if (!listing) {
      return response.status(404).json({
        message: "Listing not found",
        error: true,
        success: false
      });
    }

    // Verify ownership
    if (listing.creator.toString() !== userId.toString()) {
      return response.status(403).json({
        message: "Forbidden, you are not the owner of this listing",
        error: true,
        success: false
      });
    }

    // Update text fields
    listing.title = title || listing.title;
    listing.location = location || listing.location;
    listing.description = description || listing.description;
    listing.price = price || listing.price;

    // Update images if new files are uploaded
    if (request.files && request.files.length > 0) {
      const imageUrls = request.files.map(file => file.path); // Cloudinary URLs
      listing.image = imageUrls;
    }

    await listing.save();

    return response.status(200).json({
      message: "Listing updated successfully",
      error: false,
      success: true,
      data: listing
    });

  } catch (error) {
    console.error(error.message);
    return response.status(500).json({
      message: "Error updating listing",
      error: true,
      success: false
    });
  }
};

//delete listing by Owner
export const deleteListingById =async(request,response)=>{
    try {
        const listingId = request.params.id;
        const userId = request.userId;
        

        if(!listingId){
            return response.status(400).json(
                { 
                    message: "Listing id is required", 
                    error: true,
                    success: false 
                }
            );
        }

        if(!userId) {
            return response.status(401).json(
                { 
                    message: "Unauthorized, user not found", 
                    error: true,
                    success: false 
                }
            );
        }

        //find listing
        const listing = await Listing.findById(listingId);

        if(!listing){
            return response.status(404).json(
                { 
                    message: "Listing not found", 
                    error: true,
                    success: false 
                }
            );
        }
  

        if(listing.creator.toString() !== userId.toString()){
            return response.status(403).json(
                { 
                    message: "Forbidden, you are not the owner of this listing", 
                    error: true,
                    success: false 
                }
            );
        }

        await listing.deleteOne();


        response.status(200).json(
            { 
                message: "Listing deleted successfully", 
                error: false,
                success: true,
                
            }
        );
        
    } catch (error) {
        console.log(error.message)
        response.status(500).json(
            { 
                message: "Error deleting listing", 
                error: true,
                success: false 
            }
        );
        
    }
}

//get listings by user id
export const getListingsByUserId = async (request, response) => {
    try {
        const userId = request.userId;

        if (!userId) {
        return response.status(401).json({
            message: "Unauthorized, user not found",
            error: true,
            success: false
        });
        }

        // Fetch listings for this user
        const listing = await Listing.find({ creator: userId }).populate("creator", "name");

        response.status(200).json({
            message: "Listings fetched successfully",
            error: false,
            success: true,
            data: listing
        });

    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: "Error fetching listings",
            error: true,
            success: false
        });
    }
};

//add like to listing
export const likeListing = async (request, response) => {
    try {
        const listingId = request.params.id;
        const userId = request.userId;

        if (!listingId) {
        return response.status(400).json({
            message: "Listing id is required",
            error: true,
            success: false
        });
        }

        if (!userId) {
        return response.status(401).json({
            message: "Unauthorized, user not found",
            error: true,
            success: false
        });
        }

        //find listing
        const listing = await Listing.findById(listingId);

        if (!listing) {
        return response.status(404).json({
            message: "Listing not found",
            error: true,
            success: false
        });
        }

        //check if user already liked the listing
        if (listing.likes.includes(userId)) {
        return response.status(400).json({
            message: "You have already liked this listing",
            error: true,
            success: false
        });
        }
        
        //add like to listing
        listing.likes.push(userId);
        await listing.save();

        return response.status(200).json({
        message: "Listing liked successfully",
        error: false,
        success: true,
        data: listing
        });
        
    } catch (error) {
        console.error(error.message);
        return response.status(500).json({
            message: "Error liking listing",
            error: true,
            success: false
        });
    }
}

//add save to listing
export const saveListing = async (request, response) => {
    try {
        const listingId = request.params.id;
        const userId = request.userId;
        if (!listingId) {
            return response.status(400).json({
                message: "Listing id is required",
                error: true,
                success: false
            });
        }
        if (!userId) {
            return response.status(401).json({
                message: "Unauthorized, user not found",
                error: true,
                success: false
            });
        }
        //find listing
        const listing = await Listing.findById(listingId);
        if (!listing) {
            return response.status(404).json({
                message: "Listing not found",
                error: true,
                success: false
            });
        }
        //check if user already saved the listing
        if (listing.savedBy.includes(userId)) {
            return response.status(400).json({
                message: "You have already saved this listing",
                error: true,
                success: false
            });

        }
        //add save to listing
        listing.savedBy.push(userId);
        await listing.save();
        return response.status(200).json({
            message: "Listing saved successfully",
            error: false,
            success: true,
            data: listing
            });
    } catch (error) {
        console.error(error.message);
        return response.status(500).json({
            message: "Error saving listing",
            error: true,
            success: false
        });
    }
}