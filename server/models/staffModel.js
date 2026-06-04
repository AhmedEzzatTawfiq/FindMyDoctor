import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    role: {
        type: String,
        default: "Secretary" // e.g., Secretary, Nurse, Receptionist, Accountant
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true
    },
    clinicId: {
        type: Number,
        default: 1
    },
    status: {
        type: String,
        default: "active" // active, inactive
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Staff = mongoose.model("Staff", staffSchema);
export default Staff;
