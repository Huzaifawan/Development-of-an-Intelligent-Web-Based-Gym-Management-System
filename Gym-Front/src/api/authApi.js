import axiosInstance from "./axiosConfig";

export const authApi = {
  register: (userData) => axiosInstance.post("/auth/register", userData),
  login: (credentials) => axiosInstance.post("/auth/login", credentials),
  getProfile: () => axiosInstance.get("/auth/me"),
  updateProfile: (data) => axiosInstance.put("/auth/update", data),
  changePassword: (data) => axiosInstance.put("/auth/change-password", data),
};
