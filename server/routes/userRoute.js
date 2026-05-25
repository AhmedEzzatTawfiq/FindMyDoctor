import express from 'express'
import { bookAppointment, cancelAppointment, getAppointment, getProfileData, loginUser, registerUser, UpdateProfile, integratePaymentGateway, verifyPayment } from '../controllers/userController.js';
import authUser from '../middleware/authUser.js';
import upload from "../middleware/multer.js";

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/profile', authUser, getProfileData)
userRouter.post('/update-profile', upload.single('image'), authUser, UpdateProfile)
userRouter.post('/book-appointment', authUser, bookAppointment)
userRouter.get('/appointments', authUser, getAppointment)
userRouter.post('/cancel-appointment', authUser, cancelAppointment)
userRouter.post('/payment-gateway', authUser, integratePaymentGateway)
userRouter.post('/verify-payment', authUser, verifyPayment)

export default userRouter;