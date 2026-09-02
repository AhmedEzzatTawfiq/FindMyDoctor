import { api } from "../lib/axios";

export const loginUser = async (credentials) => {
  const { data } = await api.post("/api/user/login", credentials);
  return data;
};

export const registerUser = async (userData) => {
  const { data } = await api.post("/api/user/register", userData);
  return data;
};
