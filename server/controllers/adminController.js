import validator from "validator"
import bcrypt from "bcrypt"
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import Doctor from "../models/doctorModel.js";

// Api for adding doctor
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, specialization, experience, about, fees, address, degree } = req.body;
        const imageFile = req.file;

        //check data
        if (!name || !email || !password || !specialization || !experience || !about || !fees || !address || !degree || !imageFile) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }

        //validate email
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email" })
        }

        //validate password
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" })
        }

        //hashing doctor password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        //upload doctor image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const imageUrl = imageUpload.secure_url

        const doctorData = {
            name,
            email,
            password: hashedPassword,
            specialization,
            experience,
            about,
            fees,
            address: typeof address === 'string' ? JSON.parse(address) : address,
            degree,
            image: imageUrl,
            date: Date.now()
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()

        res.status(200).json({ success: true, message: "Doctor added successfully" })

    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, message: error.message })
    }
}



// Api for admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        //check data
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email+password, process.env.JWT_SECRET)
            res.send({success:true, token})
            
        } else {
            res.status(400).json({ success: false, message: "Invalid credentials" })
        }


    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, message: error.message })
    }
}

// Api to get all doctors
const getAllDoctors = async (req, res) => {
    try {
         const {doctor} = await Doctor.f
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

export { addDoctor, adminLogin };