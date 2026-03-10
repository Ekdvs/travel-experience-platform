import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "travel-experiences",
    allowed_formats: ["jpg", "png", "jpeg", "webp"]
  }
});

// Add 20MB limit
const upload = multer({ 
  storage,
  limits: { 
    fileSize: 20 * 1024 * 1024, // 20MB per file
    files:5 // Limit to 5 files per request
   } 
});

export default upload;