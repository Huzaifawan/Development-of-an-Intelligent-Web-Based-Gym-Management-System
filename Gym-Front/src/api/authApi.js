import axiosInstance from "./axiosConfig";

export const authApi = {
  // POST /api/auth/register
  register: (userData) => axiosInstance.post("/auth/register", userData),

  // POST /api/auth/login
  login: (credentials) => axiosInstance.post("/auth/login", credentials),

  // GET /api/auth/me
  getProfile: () => axiosInstance.get("/auth/me"),

  // PUT /api/auth/update  — body: { name, phone, address }
  updateProfile: (data) => axiosInstance.put("/auth/update", data),

  // PUT /api/auth/change-password  — body: { currentPassword, newPassword }
  changePassword: (data) => axiosInstance.put("/auth/change-password", data),
};
