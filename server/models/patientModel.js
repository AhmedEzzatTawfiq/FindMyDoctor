import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    phone2: {
        type: String
    },
    age: {
        type: Number
    },
    gender: {
        type: String
    },
    bloodType: {
        type: String
    },
    maritalStatus: {
        type: String
    },
    address: {
        type: String
    },
    allergies: {
        type: String
    },
    chronicDiseases: {
        type: String
    },
    medications: {
        type: String
    },
    notes: {
        type: String
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true
    },
    // Financial fields
    paymentStatus: {
        type: String,
        default: "unpaid" // unpaid, partial, paid
    },
    amountRequired: {
        type: Number,
        default: 0
    },
    amountPaid: {
        type: Number,
        default: 0
    },
    amountRemaining: {
        type: Number,
        default: 0
    },
    paymentDate: {
        type: Date
    },
    financialNotes: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
