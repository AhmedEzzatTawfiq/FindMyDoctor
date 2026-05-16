import mongoose from 'mongoose'

const appointmentSchema = mongoose.Schema({
    userId: {type: String, required: true},
    doctorId: {type: String, required: true},
    slotDate: {type: Object, required: true},
    slotTime: {type: Object, required: true},
    userData: {type: String, required: true},
    docData: {type: String, required: true},
    amount: {type: Number, required: true},
    status: {type: Object, required: true},
})