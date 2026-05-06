import axiosInstance from "./axiosConfig";

export const trainersApi = {
  // GET /api/trainers  — Public: all available trainers
  getAllTrainers: () => axiosInstance.get("/trainers"),

  // GET /api/trainers/:id  — Public: single trainer
  getTrainerById: (id) => axiosInstance.get(`/trainers/${id}`),

  // GET /api/trainers/:id/schedule  — Public: trainer schedule
  getTrainerSchedule: (id) => axiosInstance.get(`/trainers/${id}/schedule`),

  // POST /api/trainers  — Admin only
  // body: { name, specialisation, bio, experience, contact, profileImage, schedule, isAvailable, rating }
  createTrainer: (data) => axiosInstance.post("/trainers", data),

  // PUT /api/trainers/:id  — Admin only
  // body: { name, specialisation, bio, experience, contact, profileImage, schedule, isAvailable, rating }
  updateTrainer: (id, data) => axiosInstance.put(`/trainers/${id}`, data),

  // DELETE /api/trainers/:id  — Admin only
  deleteTrainer: (id) => axiosInstance.delete(`/trainers/${id}`),
};
