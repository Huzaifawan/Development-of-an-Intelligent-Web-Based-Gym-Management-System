import axiosInstance from "./axiosConfig";

export const usersApi = {
  // GET /api/users  — Admin only: all users
  getAllUsers: () => axiosInstance.get("/users"),

  // GET /api/users/:id  — own profile or Admin
  getUserById: (id) => axiosInstance.get(`/users/${id}`),

  // PUT /api/users/:id  — own profile or Admin
  // body: { name, phone, address }
  updateUser: (id, data) => axiosInstance.put(`/users/${id}`, data),

  // DELETE /api/users/:id  — Admin only
  deleteUser: (id) => axiosInstance.delete(`/users/${id}`),
};
