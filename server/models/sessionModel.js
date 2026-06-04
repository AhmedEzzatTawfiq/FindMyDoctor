import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true
    },
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "appointment"
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true
    },
    clinicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Clinic"
    },
    date: {
        type: Date,
        default: Date.now
    },
    diagnosis: {
        type: String
    },
    prescription: {
        type: String
    },
    notes: {
        type: String
    },
    status: {
        type: String,
        default: "completed" // completed, ongoing, cancelled
    },
    fee: {
        type: Number,
        default: 0
    },
    paid: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Session = mongoose.model("Session", sessionSchema);
export default Session;
