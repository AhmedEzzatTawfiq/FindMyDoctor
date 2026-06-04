import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Staff from "../models/staffModel.js";
import Clinic from "../models/clinicModel.js";
import Patient from "../models/patientModel.js";
import Session from "../models/sessionModel.js";
import Note from "../models/noteModel.js";
import Appointment from "../models/appointmentModel.js";

// ============================================
//  STAFF CONTROLLERS
// ============================================

export const staffLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Username and password required" });
        }

        const staff = await Staff.findOne({ username });
        if (!staff || staff.status !== "active") {
            return res.status(400).json({ success: false, message: "Invalid credentials or account inactive" });
        }

        const isMatch = await bcrypt.compare(password, staff.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: staff._id, doctorId: staff.doctorId, role: "staff" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            success: true,
            token,
            user: {
                id: staff._id,
                name: staff.name,
                username: staff.username,
                role: "staff",
                jobRole: staff.role,
                doctorId: staff.doctorId,
                clinicId: staff.clinicId
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const addStaff = async (req, res) => {
    try {
        const { name, username, password, phone, role, clinicId } = req.body;
        const doctorId = req.doctorId;

        if (req.role !== "doctor") {
            return res.status(403).json({ success: false, message: "Only doctors can add staff" });
        }

        if (!name || !username || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingStaff = await Staff.findOne({ username });
        if (existingStaff) {
            return res.status(400).json({ success: false, message: "Username already taken" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newStaff = new Staff({
            name,
            username,
            password: hashedPassword,
            phone,
            role,
            clinicId: clinicId || 1,
            doctorId
        });

        await newStaff.save();
        res.status(201).json({ success: true, message: "Staff added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const listStaff = async (req, res) => {
    try {
        const doctorId = req.doctorId;
        const staffList = await Staff.find({ doctorId }).select("-password");
        res.json({ success: true, staff: staffList });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateStaff = async (req, res) => {
    try {
        const { id, name, phone, role, status, newPassword } = req.body;
        const doctorId = req.doctorId;

        if (req.role !== "doctor") {
            return res.status(403).json({ success: false, message: "Only doctors can update staff" });
        }

        const staff = await Staff.findOne({ _id: id, doctorId });
        if (!staff) {
            return res.status(404).json({ success: false, message: "Staff member not found" });
        }

        if (name) staff.name = name;
        if (phone !== undefined) staff.phone = phone;
        if (role) staff.role = role;
        if (status) staff.status = status;

        if (newPassword) {
            const salt = await bcrypt.genSalt(10);
            staff.password = await bcrypt.hash(newPassword, salt);
        }

        await staff.save();
        res.json({ success: true, message: "Staff member updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteStaff = async (req, res) => {
    try {
        const { id } = req.body;
        const doctorId = req.doctorId;

        if (req.role !== "doctor") {
            return res.status(403).json({ success: false, message: "Only doctors can delete staff" });
        }

        const deleted = await Staff.findOneAndDelete({ _id: id, doctorId });
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Staff member not found" });
        }

        res.json({ success: true, message: "Staff member deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============================================
//  CLINIC CONTROLLERS
// ============================================

export const addClinic = async (req, res) => {
    try {
        const { name, address, phone } = req.body;
        const doctorId = req.doctorId;

        if (req.role !== "doctor") {
            return res.status(403).json({ success: false, message: "Only doctors can add branches" });
        }

        if (!name) {
            return res.status(400).json({ success: false, message: "Branch name is required" });
        }

        const newClinic = new Clinic({ name, address, phone, doctorId });
        await newClinic.save();
        res.status(201).json({ success: true, message: "Clinic branch added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const listClinics = async (req, res) => {
    try {
        const doctorId = req.doctorId;
        const clinics = await Clinic.find({ doctorId });
        res.json({ success: true, clinics });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateClinic = async (req, res) => {
    try {
        const { id, name, address, phone, active } = req.body;
        const doctorId = req.doctorId;

        if (req.role !== "doctor") {
            return res.status(403).json({ success: false, message: "Only doctors can update branches" });
        }

        const clinic = await Clinic.findOne({ _id: id, doctorId });
        if (!clinic) {
            return res.status(404).json({ success: false, message: "Branch clinic not found" });
        }

        if (name) clinic.name = name;
        if (address !== undefined) clinic.address = address;
        if (phone !== undefined) clinic.phone = phone;
        if (active !== undefined) clinic.active = active;

        await clinic.save();
        res.json({ success: true, message: "Clinic branch updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============================================
//  PATIENT CONTROLLERS
// ============================================

export const addPatient = async (req, res) => {
    try {
        const doctorId = req.doctorId;
        const {
            name, phone, phone2, age, gender, bloodType, maritalStatus,
            address, allergies, chronicDiseases, medications, notes,
            paymentStatus, amountRequired, amountPaid, paymentDate, financialNotes
        } = req.body;

        if (!name || !phone) {
            return res.status(400).json({ success: false, message: "Name and phone are required" });
        }

        const reqVal = parseFloat(amountRequired) || 0;
        const paidVal = parseFloat(amountPaid) || 0;

        const newPatient = new Patient({
            name, phone, phone2, age, gender, bloodType, maritalStatus,
            address, allergies, chronicDiseases, medications, notes,
            doctorId,
            paymentStatus: paymentStatus || "unpaid",
            amountRequired: reqVal,
            amountPaid: paidVal,
            amountRemaining: reqVal - paidVal,
            paymentDate: paymentDate || null,
            financialNotes
        });

        await newPatient.save();
        res.status(201).json({ success: true, message: "Patient registered successfully", patient: newPatient });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const listPatients = async (req, res) => {
    try {
        const doctorId = req.doctorId;
        const patients = await Patient.find({ doctorId });
        res.json({ success: true, patients });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updatePatient = async (req, res) => {
    try {
        const doctorId = req.doctorId;
        const {
            id, name, phone, phone2, age, gender, bloodType, maritalStatus,
            address, allergies, chronicDiseases, medications, notes,
            paymentStatus, amountRequired, amountPaid, paymentDate, financialNotes
        } = req.body;

        const patient = await Patient.findOne({ _id: id, doctorId });
        if (!patient) {
            return res.status(404).json({ success: false, message: "Patient not found" });
        }

        if (name) patient.name = name;
        if (phone) patient.phone = phone;
        if (phone2 !== undefined) patient.phone2 = phone2;
        if (age !== undefined) patient.age = age;
        if (gender !== undefined) patient.gender = gender;
        if (bloodType !== undefined) patient.bloodType = bloodType;
        if (maritalStatus !== undefined) patient.maritalStatus = maritalStatus;
        if (address !== undefined) patient.address = address;
        if (allergies !== undefined) patient.allergies = allergies;
        if (chronicDiseases !== undefined) patient.chronicDiseases = chronicDiseases;
        if (medications !== undefined) patient.medications = medications;
        if (notes !== undefined) patient.notes = notes;

        // Financial tracking
        if (paymentStatus) patient.paymentStatus = paymentStatus;
        if (amountRequired !== undefined) patient.amountRequired = parseFloat(amountRequired) || 0;
        if (amountPaid !== undefined) patient.amountPaid = parseFloat(amountPaid) || 0;
        patient.amountRemaining = patient.amountRequired - patient.amountPaid;
        if (paymentDate !== undefined) patient.paymentDate = paymentDate || null;
        if (financialNotes !== undefined) patient.financialNotes = financialNotes;

        await patient.save();
        res.json({ success: true, message: "Patient file updated successfully", patient });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deletePatient = async (req, res) => {
    try {
        const { id } = req.body;
        const doctorId = req.doctorId;

        const deleted = await Patient.findOneAndDelete({ _id: id, doctorId });
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Patient not found" });
        }

        // Cascade delete all sessions and notes for this patient
        await Session.deleteMany({ patientId: id });
        await Note.deleteMany({ patientId: id });

        res.json({ success: true, message: "Patient and related records deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============================================
//  SESSION CONTROLLERS
// ============================================

export const addSession = async (req, res) => {
    try {
        const doctorId = req.doctorId;
        const { patientId, appointmentId, clinicId, date, diagnosis, prescription, notes, status, fee, paid } = req.body;

        if (!patientId) {
            return res.status(400).json({ success: false, message: "Patient ID is required" });
        }

        const newSession = new Session({
            patientId,
            appointmentId: appointmentId || null,
            doctorId,
            clinicId: clinicId || null,
            date: date || new Date(),
            diagnosis,
            prescription,
            notes,
            status: status || "completed",
            fee: parseFloat(fee) || 0,
            paid: paid === true || paid === "true"
        });

        await newSession.save();

        // Increment the patient billing amount
        const patient = await Patient.findOne({ _id: patientId, doctorId });
        if (patient) {
            patient.amountRequired += newSession.fee;
            if (newSession.paid) {
                patient.amountPaid += newSession.fee;
                patient.paymentDate = newSession.date;
            }
            patient.amountRemaining = patient.amountRequired - patient.amountPaid;
            if (patient.amountRemaining <= 0) {
                patient.paymentStatus = "paid";
            } else if (patient.amountPaid > 0) {
                patient.paymentStatus = "partial";
            } else {
                patient.paymentStatus = "unpaid";
            }
            await patient.save();
        }

        res.status(201).json({ success: true, message: "Medical session registered successfully", session: newSession });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const listSessions = async (req, res) => {
    try {
        const doctorId = req.doctorId;
        const sessions = await Session.find({ doctorId }).populate("patientId", "name phone");
        res.json({ success: true, sessions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateSession = async (req, res) => {
    try {
        const doctorId = req.doctorId;
        const { id, diagnosis, prescription, notes, status, fee, paid, date } = req.body;

        const session = await Session.findOne({ _id: id, doctorId });
        if (!session) {
            return res.status(404).json({ success: false, message: "Session not found" });
        }

        const oldFee = session.fee;
        const oldPaidStatus = session.paid;

        if (diagnosis !== undefined) session.diagnosis = diagnosis;
        if (prescription !== undefined) session.prescription = prescription;
        if (notes !== undefined) session.notes = notes;
        if (status !== undefined) session.status = status;
        if (date !== undefined) session.date = date;
        if (fee !== undefined) session.fee = parseFloat(fee) || 0;
        if (paid !== undefined) session.paid = paid === true || paid === "true";

        await session.save();

        // Adjust the patient financial totals
        const patient = await Patient.findOne({ _id: session.patientId, doctorId });
        if (patient) {
            // Subtract old values
            patient.amountRequired -= oldFee;
            if (oldPaidStatus) {
                patient.amountPaid -= oldFee;
            }

            // Add new values
            patient.amountRequired += session.fee;
            if (session.paid) {
                patient.amountPaid += session.fee;
                patient.paymentDate = session.date;
            }

            patient.amountRemaining = patient.amountRequired - patient.amountPaid;
            if (patient.amountRemaining <= 0) {
                patient.paymentStatus = "paid";
            } else if (patient.amountPaid > 0) {
                patient.paymentStatus = "partial";
            } else {
                patient.paymentStatus = "unpaid";
            }
            await patient.save();
        }

        res.json({ success: true, message: "Session updated successfully", session });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteSession = async (req, res) => {
    try {
        const { id } = req.body;
        const doctorId = req.doctorId;

        const session = await Session.findOne({ _id: id, doctorId });
        if (!session) {
            return res.status(404).json({ success: false, message: "Session not found" });
        }

        // Deduct from patient's totals
        const patient = await Patient.findOne({ _id: session.patientId, doctorId });
        if (patient) {
            patient.amountRequired -= session.fee;
            if (session.paid) {
                patient.amountPaid -= session.fee;
            }
            patient.amountRemaining = patient.amountRequired - patient.amountPaid;
            if (patient.amountRemaining <= 0) {
                patient.paymentStatus = "paid";
            } else if (patient.amountPaid > 0) {
                patient.paymentStatus = "partial";
            } else {
                patient.paymentStatus = "unpaid";
            }
            await patient.save();
        }

        await Session.findByIdAndDelete(id);
        res.json({ success: true, message: "Session deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============================================
//  NOTE CONTROLLERS
// ============================================

export const addNote = async (req, res) => {
    try {
        const doctorId = req.doctorId;
        const { title, content, tag, priority, patientId } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, message: "Title is required" });
        }

        const newNote = new Note({
            title,
            content,
            tag: tag || "General",
            priority: priority || "normal",
            patientId: patientId || null,
            doctorId
        });

        await newNote.save();
        res.status(201).json({ success: true, message: "Note added successfully", note: newNote });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const listNotes = async (req, res) => {
    try {
        const doctorId = req.doctorId;
        const notes = await Note.find({ doctorId }).populate("patientId", "name");
        res.json({ success: true, notes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateNote = async (req, res) => {
    try {
        const doctorId = req.doctorId;
        const { id, title, content, tag, priority, patientId } = req.body;

        const note = await Note.findOne({ _id: id, doctorId });
        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }

        if (title) note.title = title;
        if (content !== undefined) note.content = content;
        if (tag) note.tag = tag;
        if (priority) note.priority = priority;
        if (patientId !== undefined) note.patientId = patientId || null;

        await note.save();
        res.json({ success: true, message: "Note updated successfully", note });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteNote = async (req, res) => {
    try {
        const { id } = req.body;
        const doctorId = req.doctorId;

        const deleted = await Note.findOneAndDelete({ _id: id, doctorId });
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }

        res.json({ success: true, message: "Note deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============================================
//  BACKUP & RESTORE CONTROLLERS
// ============================================

export const exportData = async (req, res) => {
    try {
        const doctorId = req.doctorId;

        if (req.role !== "doctor") {
            return res.status(403).json({ success: false, message: "Only doctors can export data" });
        }

        const patients = await Patient.find({ doctorId });
        const sessions = await Session.find({ doctorId });
        const clinics = await Clinic.find({ doctorId });
        const notes = await Note.find({ doctorId });
        const staff = await Staff.find({ doctorId }).select("-password");

        const dataDump = {
            exportDate: new Date(),
            doctorId,
            patients,
            sessions,
            clinics,
            notes,
            staff
        };

        res.json({ success: true, data: dataDump });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const importData = async (req, res) => {
    try {
        const doctorId = req.doctorId;
        const { backupData } = req.body;

        if (req.role !== "doctor") {
            return res.status(403).json({ success: false, message: "Only doctors can import data" });
        }

        if (!backupData) {
            return res.status(400).json({ success: false, message: "No backup data provided" });
        }

        const parsed = typeof backupData === "string" ? JSON.parse(backupData) : backupData;

        // Perform transactional clean slate deletion first for this doctor
        await Patient.deleteMany({ doctorId });
        await Session.deleteMany({ doctorId });
        await Clinic.deleteMany({ doctorId });
        await Note.deleteMany({ doctorId });

        // Map and insert patients (remap IDs if necessary, or preserve raw IDs)
        if (parsed.patients && parsed.patients.length > 0) {
            const patientsWithDocId = parsed.patients.map(p => {
                delete p._id; // Let Mongo allocate fresh ObjectIds
                p.doctorId = doctorId;
                return p;
            });
            await Patient.insertMany(patientsWithDocId);
        }

        // Map and insert sessions
        if (parsed.sessions && parsed.sessions.length > 0) {
            const sessionsWithDocId = parsed.sessions.map(s => {
                delete s._id;
                s.doctorId = doctorId;
                return s;
            });
            await Session.insertMany(sessionsWithDocId);
        }

        // Map and insert clinics
        if (parsed.clinics && parsed.clinics.length > 0) {
            const clinicsWithDocId = parsed.clinics.map(c => {
                delete c._id;
                c.doctorId = doctorId;
                return c;
            });
            await Clinic.insertMany(clinicsWithDocId);
        }

        // Map and insert notes
        if (parsed.notes && parsed.notes.length > 0) {
            const notesWithDocId = parsed.notes.map(n => {
                delete n._id;
                n.doctorId = doctorId;
                return n;
            });
            await Note.insertMany(notesWithDocId);
        }

        res.json({ success: true, message: "All backup data imported successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const resetAll = async (req, res) => {
    try {
        const doctorId = req.doctorId;

        if (req.role !== "doctor") {
            return res.status(403).json({ success: false, message: "Only doctors can reset the database" });
        }

        await Patient.deleteMany({ doctorId });
        await Session.deleteMany({ doctorId });
        await Clinic.deleteMany({ doctorId });
        await Note.deleteMany({ doctorId });

        res.json({ success: true, message: "All clinic CRM records wiped successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
