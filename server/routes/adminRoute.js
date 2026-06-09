import express from "express";
import {
    addDoctor,
    adminLogin,
    getAllDoctors,
    getAllAppointments,
    cancelAppointmentAdmin,
    getDashboardData
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
adminRouter.post("/cancel-appointment", authAdmin, cancelAppointmentAdmin);
adminRouter.get("/dashboard", authAdmin, getDashboardData);

export default adminRouter;