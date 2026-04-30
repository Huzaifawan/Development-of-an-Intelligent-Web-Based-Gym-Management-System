import axiosInstance from "./axiosConfig";

export const membershipsApi = {
  getAllMemberships: () => axiosInstance.get("/memberships"),
  getMembershipById: (id) => axiosInstance.get(`/memberships/${id}`),
  purchaseMembership: (data) => axiosInstance.post("/memberships", data), // ✅ Fixed: was /memberships/purchase
  getUserMemberships: () => axiosInstance.get("/memberships/my"), // ✅ Fixed: was /memberships/user
  cancelMembership: (id) => axiosInstance.delete(`/memberships/${id}`),
};
