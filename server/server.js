import dotenv from "dotenv";
import express from "express";
import connectDB from "./configs/db.js";
import connectCloudinary from "./configs/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";
import crmRouter from "./routes/crmRoute.js";
import staffRouter from "./routes/staffRoute.js";




dotenv.config({ path: ['.env'] });
//app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

//middleware
app.use(express.json());

const stripTrailingSlash = (url) => url?.replace(/\/$/, '') ?? url;

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'https://find-my-doctor-eta.vercel.app',
    process.env.CLIENT_URL,
    process.env.ADMIN_URL,
].map(stripTrailingSlash).filter(Boolean);

const isOriginAllowed = (origin) => {
    if (!origin) return true;
    const normalized = stripTrailingSlash(origin);
    if (allowedOrigins.includes(normalized)) return true;
    // Any Vercel production or preview deployment (*.vercel.app)
    return normalized.startsWith('https://') && normalized.endsWith('.vercel.app');
};

// Explicit CORS headers (reliable on Railway; cors package alone was not sending Allow-Origin)
app.use((req, res, next) => {
    const origin = req.headers.origin;

    if (origin && isOriginAllowed(origin)) {
        res.setHeader('Access-Control-Allow-Origin', stripTrailingSlash(origin));
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        req.headers['access-control-request-headers'] || 'Content-Type, Authorization, token, atoken, stoken, dtoken'
    );

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    next();
});

app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; worker-src 'self' blob:; object-src 'self';")
    next()
})

//api endpoints
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);
app.use("/api/crm", crmRouter);
app.use("/api/staff", staffRouter);



app.get("/", (req, res) => {
    res.send("Api working")
})


if (!process.env.VERCEL) {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })
}

export default app;
