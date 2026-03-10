import mongoose from "mongoose";

const listingSchema =  new mongoose.Schema(
    {
        title:{
            type:String,
            required:[  true,"Please enter listing title"],
            
        },
        location:{
            type:String,
            required:[  true,"Please enter listing location"],
        },
        description:{
            type:String,
            required:[  true,"Please enter listing description"],
        },
        price:{
            type:Number,
            required:[  true,"Please enter listing price"],
        },
        image:{
            type:[String],
            required:[  true,"Please enter listing image"],
        },
        creator:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        likes:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            }
        ],
        savedBy:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            }
        ]
    },
    {
        timestamps:true
    }
)

const Listing = mongoose.model("Listing",listingSchema);

export default Listing;