import { api } from "../lib/axios";

export const getDoctors = async () => {
  const { data } = await api.get("/api/doctor/list");
  return data;
};
