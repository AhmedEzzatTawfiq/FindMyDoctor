import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";
import connectCloudinary from "./configs/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";




dotenv.config({ path: ['.env.local', '.env'] });
//app config
const app = express();
const port = process.env.PORT || 5000;
connectDB();
connectCloudinary();

//middleware
app.use(express.json());
app.use(cors());

//api endpoints
app.use("/api/admin", adminRouter);



app.get("/", (req, res) => {
    res.send("Api working")
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})