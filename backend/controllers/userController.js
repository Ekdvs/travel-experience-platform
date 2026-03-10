import User from "../model/User.js";
import bcrypt from 'bcrypt';
import generatedAccesToken from "../utill/genaratedAccesToken.js";
import generateRefreshToken from "../utill/genaratedRefreshToken.js";

//register User
export const registerUser = async (request,response)=>{
    try {

        const {name,email,password} = request.body;

        //validate user input
        if(!name || !email || !password){
            return response.status(400).json({
                message:'All fields are required',
                error:true,
                success:false
            })
        }

        const existingUser = await User.findOne({email});

        if(existingUser){
            return response.status(400).json({
                message:'User already exists',
                error:true,
                success:false
            })
        }

        //password hashing
        const salt = await bcrypt.genSalt(16);
        const hashedPassword = await bcrypt.hash(password,salt);

        //create new user
        const newUser = new User(
            {
                name,
                email,
                password:hashedPassword
            }
        )

        await newUser.save();

        return response.status(201).json({
            message:'User registered successfully',
            error:false,
            success:true,
            data:{user:newUser}
        })
        
    } catch (error) {
        console.log(error.message)
        return response.status(500).json({
            message:'Internal sever error',
            error:true,
            success:false
    })
    }


}

//login user
export const loginUser = async(request,response)=>{
    try {
        const {email,password} = request.body;
        if(!email || !password){
            return response.status(400).json({
                message:'Please provide all required fields',
                error:true,
                success:false
            })
        }
        
        const user = await User.findOne({email:email.toLowerCase()});
        if(!user){
            return response.status(400).json({
                message:'Invalid email or password',
                error:true,
                success:false
            })
        }
        
        const checkpassword = await bcrypt.compare(password,user.password);
        if(!checkpassword){
            return response.status(400).json({
                message:'Invalid email or password',
                error:true,
                success:false
            })
        }

        //update last login date
        user.lastLoginDate = new Date();
        await user.save();

        //create access token and refresh token
        const accessToken = await generatedAccesToken(user);
        const refreshToken = await generateRefreshToken(user);

        return response.status(200).json({
            message:'User logged in successfully',
            error:false,
            success:true,
            data:{
                accessToken,
                refreshToken,
                userInfo:user
            }
        })


    } catch (error) {
        console.log(error.message)
        return response.status(500).json({
            message:'Internal sever error',
            error:true,
            success:false
            
        })
    }
}

//get user profile
