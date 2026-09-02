import { api } from "../lib/axios";

export const bookAppointment = async (appointmentData) => {
  const { data } = await api.post("/api/user/book-appointment", appointmentData);
  return data;
};

export const getUserAppointments = async () => {
  const { data } = await api.get("/api/user/appointments");
  return data;
};

export const cancelAppointment = async (appointmentId) => {
  const { data } = await api.post("/api/user/cancel-appointment", { appointmentId });
  return data;
};

export const initiatePayment = async (appointmentId) => {
  const { data } = await api.post("/api/user/payment-gateway", { appointmentId });
  return data;
};

export const verifyPayment = async (paymentData) => {
  const { data } = await api.post("/api/user/verify-payment", paymentData);
  return data;
};
