import express from 'express'
import { signUp,signIn } from '../controller/auth.js'
const authRouter=express.Router()

authRouter.post('/SignIn',signIn)
authRouter.post('/SignUp',signUp)


export default authRouter;