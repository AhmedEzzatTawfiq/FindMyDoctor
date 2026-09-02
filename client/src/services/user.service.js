import { api } from "../lib/axios";

export const getUserProfile = async () => {
  const { data } = await api.get("/api/user/profile");
  return data;
};

export const updateUserProfile = async (formData) => {
  const { data } = await api.post("/api/user/update-profile", formData);
  return data;
};
