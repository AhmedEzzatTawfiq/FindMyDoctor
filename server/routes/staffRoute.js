import express from "express";
import {
    staffLogin
} from "../controllers/staffController.js";
import authStaff from "../middleware/authStaff.js";

const staffRouter = express.Router();

staffRouter.post("/login", staffLogin);

export default staffRouter;
