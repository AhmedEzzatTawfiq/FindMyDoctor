import mongoose from "mongoose";

const clinicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    phone: {
        type: String
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }
});

const Clinic = mongoose.model("Clinic", clinicSchema);
export default Clinic;
