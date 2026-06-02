import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";
import connectCloudinary from "./configs/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";




dotenv.config({ path: ['.env'] });
//app config
const app = express();
const port = process.env.PORT || 4000;

//middleware
app.use(express.json());

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'https://your-doctor-here.vercel.app',
    process.env.CLIENT_URL,
    process.env.ADMIN_URL,
].filter(Boolean);

const isOriginAllowed = (origin) => {
    if (!origin) return true;
    return allowedOrigins.includes(origin) || origin.endsWith('.vercel.app');
};

app.use(cors({
    origin(origin, callback) {
        if (isOriginAllowed(origin)) {
            // Pass the origin string so Allow-Origin is set on every response (including 500s)
            callback(null, origin || true);
        } else {
            console.warn('CORS blocked for origin:', origin);
            callback(null, false);
        }
    },
    credentials: true,
}));

app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; worker-src 'self' blob:; object-src 'self';")
    next()
})

//api endpoints
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);



app.get("/", (req, res) => {
    res.send("Api working") 
})


const startServer = async () => {
    try {
        await connectDB();
        connectCloudinary();

        if (!process.env.VERCEL) {
            app.listen(port, () => {
                console.log(`Server is running on port ${port}`);
            });
        }
    } catch (error) {
        console.error("Server failed to start:", error.message);
        process.exit(1);
    }
};

startServer();

export default app;
