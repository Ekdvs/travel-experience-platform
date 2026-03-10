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
        console.log(error)
        response.status(500).json(
            { 
                message: "Error creating listing", 
                error: true,
                success: false 
            }
        );
    }
}