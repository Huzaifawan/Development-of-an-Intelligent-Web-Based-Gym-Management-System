import axiosInstance from "./axiosConfig";

export const membershipsApi = {
  purchaseMembership: (data) => axiosInstance.post("/memberships", data),
  getUserMembership: () => axiosInstance.get("/memberships/my"),
  getUserMemberships: () => axiosInstance.get("/memberships/my"), // alias for compatibility
  getAllMemberships: () => axiosInstance.get("/memberships"),
  updateMembership: (id, data) => axiosInstance.put(`/memberships/${id}`, data),
  cancelMembership: (id) => axiosInstance.delete(`/memberships/${id}`),
};
