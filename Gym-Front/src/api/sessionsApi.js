import axiosInstance from "./axiosConfig";

export const sessionsApi = {
  bookSession: (data) => axiosInstance.post("/sessions", data),
  getMySessions: () => axiosInstance.get("/sessions/my"),
  cancelSession: (id) => axiosInstance.delete(`/sessions/${id}`),
  getAllSessions: () => axiosInstance.get("/sessions"),
};
