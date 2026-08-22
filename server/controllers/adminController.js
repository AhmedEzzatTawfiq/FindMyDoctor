import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import streamifier from "streamifier";
import { v2 as cloudinary } from "cloudinary";

import doctorModel from "../models/DoctorModel.js";
import Appointment from "../models/appointmentModel.js";
import User from "../models/UserModel.js";

// Cloudinary upload helper
const streamUpload = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { resource_type: "image" },
            (error, result) => error ? reject(error) : resolve(result)
        );

        streamifier.createReadStream(buffer).pipe(stream);
    });
};

// Add doctor
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
            degree,
            title,
            gender
        } = req.body;

        const imageFile = req.file;

        if (!name || !email || !password || !specialization || !experience ||
            !about || !fees || !address || !degree || !imageFile) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (!validator.isEmail(email))
            return res.status(400).json({ success: false, message: "Invalid email" });

        if (password.length < 8)
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long"
            });

        const existingDoctor = await doctorModel.findOne({ email });

        if (existingDoctor)
            return res.status(400).json({
                success: false,
                message: "Doctor already exists"
            });

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await streamUpload(imageFile.buffer);

        let parsedAddress;

        try {
            parsedAddress = typeof address === "string"
                ? JSON.parse(address)
                : address;
        } catch {
            return res.status(400).json({
                success: false,
                message: "Invalid address format"
            });
        }

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
            image: result.secure_url,
            title: title || "Specialist",
            gender: gender || "Male",
            date: Date.now()
        };

        await doctorModel.create(doctorData);

        res.status(201).json({
            success: true,
            message: "Doctor added successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const isAdmin =
            email === process.env.ADMIN_EMAIL &&
            password === process.env.ADMIN_PASSWORD;

        const isDemo =
            email === process.env.DEMO_EMAIL &&
            password === process.env.DEMO_PASSWORD;

        if (!isAdmin && !isDemo) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            { email: process.env.ADMIN_EMAIL },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            success: true,
            token,
            role: isDemo ? "demo" : "admin"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all doctors
const getAllDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select("-password");

        res.json({ success: true, doctors });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all appointments
const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment
            .find({})
            .sort({ date: -1 });

        res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete appointment
const deleteAppointmentAdmin = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        await Appointment.findByIdAndDelete(appointmentId);

        res.json({
            success: true,
            message: "Appointment deleted"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get dashboard data
const getDashboardData = async (req, res) => {
    try {
        const doctors = await doctorModel.countDocuments();
        const appointments = await Appointment.countDocuments();
        const patients = await User.countDocuments();

        const latestAppointments = await Appointment
            .find({})
            .sort({ date: -1 })
            .limit(5);

        res.json({
            success: true,
            dashData: {
                doctors,
                appointments,
                patients,
                latestAppointments
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete doctor
const deleteDoctor = async (req, res) => {
    try {
        const { docId } = req.body;

        await doctorModel.findByIdAndDelete(docId);

        res.json({
            success: true,
            message: "Doctor deleted successfully"
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
    deleteAppointmentAdmin,
    getDashboardData,
    deleteDoctor
};