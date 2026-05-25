import validator from 'validator'
import bcrypt from 'bcrypt'
import User from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from "cloudinary";
import Appointment from '../models/appointmentModel.js'
import Doctor from '../models/doctorModel.js'
import axios from 'axios'
import streamifier from 'streamifier'

// Helper function for cloudinary upload
const streamUpload = (buffer) => {
    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'image' },
            (error, result) => {

                if (error) {
                    reject(error)
                } else {
                    resolve(result)
                }
            }
        )

        streamifier.createReadStream(buffer).pipe(stream)
    })
}


// API to register user
const registerUser = async (req, res) => {

    try {

        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Missing details'
            })
        }

        // Check if email is valid
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Enter a valid email'
            })
        }

        // Check password length
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters'
            })
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            })
        }

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        // Save user
        const newUser = new User(userData)
        const user = await newUser.save()

        // Create token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.status(201).json({
            success: true,
            token
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


// API for user login
const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Missing credentials'
            })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User does not exist'
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            })
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.json({
            success: true,
            token
        })

    } catch (error) {

        console.log(error)

        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


// API to get user profile data
const getProfileData = async (req, res) => {

    try {

        const { userId } = req.body

        const userData = await User.findById(userId).select('-password')

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        res.json({
            success: true,
            userData
        })

    } catch (error) {

        console.log(error)

        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


// API to update user profile
const UpdateProfile = async (req, res) => {

    try {

        const {
            userId,
            name,
            phone,
            d_birth,
            address,
            gender
        } = req.body

        const imageFile = req.file

        if (!name || !phone || !d_birth || !gender || !address) {
            return res.status(400).json({
                success: false,
                message: 'Missing data'
            })
        }

        // Safe address parsing
        let parsedAddress

        try {

            parsedAddress =
                typeof address === 'string'
                    ? JSON.parse(address)
                    : address

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: 'Invalid address format'
            })
        }

        await User.findByIdAndUpdate(userId, {
            name,
            phone,
            d_birth,
            gender,
            address: parsedAddress
        })

        // Upload image if exists
        if (imageFile) {

            const result = await streamUpload(imageFile.buffer)

            await User.findByIdAndUpdate(userId, {
                image: result.secure_url
            })
        }

        res.json({
            success: true,
            message: 'Profile Updated'
        })

    } catch (error) {

        console.log(error)

        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


// API to book appointment
const bookAppointment = async (req, res) => {

    try {

        const {
            userId,
            docId,
            slotTime,
            slotDate
        } = req.body

        const docData = await Doctor.findById(docId).select('-password')

        if (!docData) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            })
        }

        if (!docData.available) {
            return res.status(400).json({
                success: false,
                message: 'Doctor not available'
            })
        }

        let slots_booked = docData.slots_booked || {}

        if (slots_booked[slotDate]) {

            if (slots_booked[slotDate].includes(slotTime)) {

                return res.status(400).json({
                    success: false,
                    message: 'Slot not available'
                })
            }

            slots_booked[slotDate].push(slotTime)

        } else {

            slots_booked[slotDate] = [slotTime]
        }

        const userData = await User.findById(userId).select('-password')

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotDate,
            slotTime,
            date: Date.now()
        }

        const newAppointment = new Appointment(appointmentData)

        await newAppointment.save()

        // Save slots
        await Doctor.findByIdAndUpdate(docId, {
            slots_booked
        })

        res.json({
            success: true,
            message: 'Appointment Booked'
        })

    } catch (error) {

        console.log(error)

        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


// API to get user appointments
const getAppointment = async (req, res) => {

    try {

        const { userId } = req.body

        const appointments = await Appointment.find({ userId })

        res.json({
            success: true,
            appointments
        })

    } catch (error) {

        console.log(error)

        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


// API to cancel appointment
const cancelAppointment = async (req, res) => {

    try {

        const { userId, appointmentId } = req.body

        const appointmentData = await Appointment.findById(appointmentId)

        if (!appointmentData) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            })
        }

        // Verify appointment ownership
        if (appointmentData.userId.toString() !== userId) {

            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            })
        }

        // Cancel appointment
        await Appointment.findByIdAndUpdate(
            appointmentId,
            { canceled: true }
        )

        // Release slot
        const {
            docId,
            slotDate,
            slotTime
        } = appointmentData

        const doctorData = await Doctor.findById(docId)

        let slots_booked = doctorData.slots_booked

        if (slots_booked[slotDate]) {

            slots_booked[slotDate] =
                slots_booked[slotDate].filter(
                    time => time !== slotTime
                )
        }

        await Doctor.findByIdAndUpdate(docId, {
            slots_booked
        })

        res.json({
            success: true,
            message: 'Appointment cancelled'
        })

    } catch (error) {

        console.log(error)

        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


// API to integrate payment gateway
const integratePaymentGateway = async (req, res) => {

    try {

        const { appointmentId } = req.body

        const appointmentData = await Appointment.findById(appointmentId)

        if (!appointmentData || appointmentData.payment) {

            return res.status(400).json({
                success: false,
                message: "Appointment not found or already paid"
            })
        }

        const amount = appointmentData.amount * 100

        // 1. Auth Token
        const authResponse = await axios.post(
            `${process.env.PAYMENT_API_URL}/auth/tokens`,
            {
                api_key: process.env.PAYMENT_API_KEY
            }
        )

        const authToken = authResponse.data.token

        // 2. Order Registration
        const orderResponse = await axios.post(
            `${process.env.PAYMENT_API_URL}/ecommerce/orders`,
            {
                auth_token: authToken,
                delivery_needed: false,
                amount_cents: amount,
                currency: "EGP",
                items: []
            }
        )

        const orderId = orderResponse.data.id

        // 3. Payment Key
        const paymentKeyResponse = await axios.post(
            `${process.env.PAYMENT_API_URL}/acceptance/payment_keys`,
            {
                auth_token: authToken,
                amount_cents: amount,
                expiration: 3600,
                order_id: orderId,

                billing_data: {
                    apartment: "NA",
                    email: appointmentData.userData.email,
                    floor: "NA",
                    first_name: appointmentData.userData.name,
                    street: "NA",
                    building: "NA",
                    phone_number: appointmentData.userData.phone || "NA",
                    shipping_method: "NA",
                    postal_code: "NA",
                    city: "Cairo",
                    country: "EG",
                    last_name: "User",
                    state: "Cairo"
                },

                currency: "EGP",
                integration_id: process.env.PAYMENT_INTEGRATION_ID,
                lock_order_when_paid: false
            }
        )

        // Save order ID
        appointmentData.paymentOrderId = String(orderId)

        await appointmentData.save()

        const paymentUrl =
            `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMENT_IFRAME_ID}?payment_token=${paymentKeyResponse.data.token}`

        res.json({
            success: true,
            paymentUrl
        })

    } catch (error) {

        console.log(error)

        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


// API to verify payment
const verifyPayment = async (req, res) => {

    try {

        const { success, orderId } = req.body

        if (success === "true" || success === true) {

            await Appointment.findOneAndUpdate(
                { paymentOrderId: String(orderId) },
                { payment: true }
            )

            return res.json({
                success: true,
                message: 'Payment Successful'
            })
        }

        res.status(400).json({
            success: false,
            message: 'Payment Failed'
        })

    } catch (error) {

        console.log(error)

        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export {
    registerUser,
    loginUser,
    getProfileData,
    UpdateProfile,
    bookAppointment,
    getAppointment,
    cancelAppointment,
    integratePaymentGateway,
    verifyPayment
}