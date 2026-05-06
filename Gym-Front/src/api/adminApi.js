import axiosInstance from "./axiosConfig";

export const adminApi = {
  // GET /api/admin/dashboard  — Admin only
  // Returns: totalUsers, activeMembers, totalTrainers, expiredMemberships, totalRevenue, recentUsers, recentMemberships
  getDashboardStats: () => axiosInstance.get("/admin/dashboard"),

  // GET /api/admin/members  — Admin only: all members with membership info
  getAllMembersWithDetails: () => axiosInstance.get("/admin/members"),

  // PUT /api/admin/users/:id/toggle-active  — Admin only: activate/deactivate user
  toggleUserActive: (id) => axiosInstance.put(`/admin/users/${id}/toggle-active`),
};
