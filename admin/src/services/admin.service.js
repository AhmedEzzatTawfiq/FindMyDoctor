import { api } from "../lib/axios";

export const adminLogin = async (credentials) => {
  const { data } = await api.post("/api/admin/login", credentials);
  return data;
};

export const getAllDoctors = async () => {
  const { data } = await api.get("/api/admin/all-doctors");
  return data;
};

export const addDoctor = async (formData) => {
  const { data } = await api.post("/api/admin/add-doctor", formData);
  return data;
};

export const getAllAppointments = async () => {
  const { data } = await api.get("/api/admin/appointments");
  return data;
};

export const getAdminDashboard = async () => {
  const { data } = await api.get("/api/admin/dashboard");
  return data;
};

export const changeAvailability = async (docId) => {
  const { data } = await api.post("/api/admin/change-availability", { docId });
  return data;
};

export const deleteAppointment = async (appointmentId) => {
  const { data } = await api.post("/api/admin/delete-appointment", { appointmentId });
  return data;
};

export const deleteDoctor = async (docId) => {
  const { data } = await api.post("/api/admin/delete-doctor", { docId });
  return data;
};
