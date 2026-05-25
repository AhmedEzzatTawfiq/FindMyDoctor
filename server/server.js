import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";
import connectCloudinary from "./configs/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";

dotenv.config({ path: ['.env.local', '.env'] });

const app = express();
const port = process.env.PORT || 5000;

// Connect database & cloudinary
connectDB();
connectCloudinary();

// Middleware
app.use(express.json());

app.use(cors({
    origin: [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://find-your-doctor-ashen.vercel.app"
    ],
    credentials: true
}));

// Routes
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
    res.send("API Working");
});

// Run locally only
if (process.env.VERCEL !== "1") {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

// Export for Vercel
export default app;
