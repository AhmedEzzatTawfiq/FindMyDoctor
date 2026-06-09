import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/DoctorModel.js";
import jwt from "jsonwebtoken";
import streamifier from "streamifier";


// Helper function for Cloudinary upload
const streamUpload = (buffer) => {

    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
            { resource_type: "image" },

            (error, result) => {

                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        streamifier
            .createReadStream(buffer)
            .pipe(stream);
    });
};


// API for adding doctor
const addDoctor = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            specialization,
            experience,
            about,
            fees,
            address,
            degree
        } = req.body;

        const imageFile = req.file;

        // Check required fields
        if (
            !name ||
            !email ||
            !password ||
            !specialization ||
            !experience ||
            !about ||
            !fees ||
            !address ||
            !degree ||
            !imageFile
        ) {

            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Validate email
        if (!validator.isEmail(email)) {

            return res.status(400).json({
                success: false,
                message: "Invalid email"
            });
        }

        // Validate password
        if (password.length < 8) {

            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long"
            });
        }

        // Check if doctor already exists
        const existingDoctor = await doctorModel.findOne({ email });

        if (existingDoctor) {

            return res.status(400).json({
                success: false,
                message: "Doctor already exists"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(
            password,
            salt
        );

        // Upload image to Cloudinary
        const result = await streamUpload(
            imageFile.buffer
        );

        const imageUrl = result.secure_url;

        // Safe address parsing
        let parsedAddress;

        try {

            parsedAddress =
                typeof address === "string"
                    ? JSON.parse(address)
                    : address;

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: "Invalid address format"
            });
        }

        // Doctor data
        const doctorData = {
            name,
            email,
            password: hashedPassword,
            specialization,
            experience,
            about,
            fees,
            address: parsedAddress,
            degree,
            image: imageUrl,
            date: Date.now()
        };

        // Save doctor
        const newDoctor = new doctorModel(doctorData);

        await newDoctor.save();

        res.status(201).json({
            success: true,
            message: "Doctor added successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// API for admin login
const adminLogin = async (req, res) => {

    try {

        const { email, password } = req.body;

        // Check credentials
        if (
            email === process.env.ADMIN_EMAIL &&
            password === process.env.ADMIN_PASSWORD
        ) {

            const token = jwt.sign(
                { email },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            return res.json({
                success: true,
                token
            });
        }

        res.status(400).json({
            success: false,
            message: "Invalid credentials"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// API to get all doctors
const getAllDoctors = async (req, res) => {

    try {

        const doctors = await doctorModel
            .find({})
            .select("-password");

        res.json({
            success: true,
            doctors
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// API to get all appointments
const getAllAppointments = async (req, res) => {
    try {
        const appointments = await (await import('../models/appointmentModel.js')).default
            .find({})
            .sort({ date: -1 });

        res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};


// API to cancel appointment (admin)
const cancelAppointmentAdmin = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const Appointment = (await import('../models/appointmentModel.js')).default;

        await Appointment.findByIdAndUpdate(appointmentId, { canceled: true });

        res.json({ success: true, message: 'Appointment cancelled' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};


// API to get dashboard summary
const getDashboardData = async (req, res) => {
    try {
        const Appointment = (await import('../models/appointmentModel.js')).default;
        const User        = (await import('../models/UserModel.js')).default;

        const doctors      = await doctorModel.countDocuments();
        const appointments = await Appointment.countDocuments();
        const patients     = await User.countDocuments();

        const latestAppointments = await Appointment
            .find({})
            .sort({ date: -1 })
            .limit(5);

        res.json({
            success: true,
            dashData: { doctors, appointments, patients, latestAppointments }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};


export {
    addDoctor,
    adminLogin,
    getAllDoctors,
    getAllAppointments,
    cancelAppointmentAdmin,
    getDashboardData
};