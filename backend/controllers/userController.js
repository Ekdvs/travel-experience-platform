import User from "../model/User.js";
import bcrypt from 'bcrypt';

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