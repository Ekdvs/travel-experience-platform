import express from 'express'
import { getUserData, loginUser, logOutUser, refreshAccessToken, registerUser } from '../controllers/userController.js'
import auth from '../middleware/auth.js'


const userRouter = express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/me',auth, getUserData)
userRouter.post('/logout',auth, logOutUser)
userRouter.post('/refresh-token',refreshAccessToken)

export default userRouter