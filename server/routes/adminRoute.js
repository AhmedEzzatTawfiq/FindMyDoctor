import express from "express";
import {
    addDoctor,
    adminLogin,
    getAllDoctors,
    getAllAppointments,
    deleteAppointmentAdmin,
    getDashboardData,
    deleteDoctor
} from "../controllers/adminController.js";
import upload from "../middleware/multer.js";
import authAdmin from "../middleware/authAdmin.js";
import { changeAvailablity } from "../controllers/doctorController.js";

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);
adminRouter.get("/all-doctors", authAdmin, getAllDoctors);
adminRouter.post("/change-availability", authAdmin, changeAvailablity);
adminRouter.get("/appointments", authAdmin, getAllAppointments);
adminRouter.post("/delete-appointment", authAdmin, deleteAppointmentAdmin);
adminRouter.get("/dashboard", authAdmin, getDashboardData);
adminRouter.post("/delete-doctor", authAdmin, deleteDoctor);

export default adminRouter;