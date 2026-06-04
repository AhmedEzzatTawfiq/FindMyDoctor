import express from "express";
import authCrm from "../middleware/authCrm.js";
import {
    staffLogin, addStaff, listStaff, updateStaff, deleteStaff,
    addClinic, listClinics, updateClinic,
    addPatient, listPatients, updatePatient, deletePatient,
    addSession, listSessions, updateSession, deleteSession,
    addNote, listNotes, updateNote, deleteNote,
    exportData, importData, resetAll
} from "../controllers/crmController.js";

const crmRouter = express.Router();

// Staff Auth
crmRouter.post("/staff/login", staffLogin);

// Protect all other CRM routes with authCrm middleware
crmRouter.use(authCrm);

// Staff Management
crmRouter.post("/staff/add", addStaff);
crmRouter.get("/staff/list", listStaff);
crmRouter.post("/staff/update", updateStaff);
crmRouter.post("/staff/delete", deleteStaff);

// Clinic/Branch Management
crmRouter.post("/clinic/add", addClinic);
crmRouter.get("/clinic/list", listClinics);
crmRouter.post("/clinic/update", updateClinic);

// Patient Management
crmRouter.post("/patient/add", addPatient);
crmRouter.get("/patient/list", listPatients);
crmRouter.post("/patient/update", updatePatient);
crmRouter.post("/patient/delete", deletePatient);

// Session Management
crmRouter.post("/session/add", addSession);
crmRouter.get("/session/list", listSessions);
crmRouter.post("/session/update", updateSession);
crmRouter.post("/session/delete", deleteSession);

// Note Management
crmRouter.post("/note/add", addNote);
crmRouter.get("/note/list", listNotes);
crmRouter.post("/note/update", updateNote);
crmRouter.post("/note/delete", deleteNote);

// Backup & Data management
crmRouter.get("/data/export", exportData);
crmRouter.post("/data/import", importData);
crmRouter.post("/data/reset", resetAll);

export default crmRouter;
