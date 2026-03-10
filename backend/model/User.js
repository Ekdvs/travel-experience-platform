import mongoose from "mongoose";
import { use } from "react";

const userSchema =   new mongoose.Schema(
    {
        name:{
            type:String,
            required:[  true,"Please enter your name"],
            trime:true,
            maxlength:[  50,"Name cannot exceed 50 characters"]
        },
        email:{
            type:String,
            required:[  true,"Please enter your email"],
            unique:true,
            trime:true,
            lowercase:true,
            match:[  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"Please enter a valid email"]
        },
        password:{
            type:String,
            required:[  true,"Please enter your password"],
            minlength:[  6,"Password must be at least 6 characters"]
        },
        avatar:{
            type:String,
             default:"https://res.cloudinary.com/dzjzj0r8c/image/upload/v1690000000/default-avatar.png"
        },
        refreshToken:{
            type:String,
            default:""
        },
        lastLoginDate:{
            type:Date,
             default:''
        }

    },
    {
        timestamps:true
    }   
)

//password reomeve when featching user data
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model("User",userSchema);

export default User;