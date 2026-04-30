import axiosInstance from "./axiosConfig";

export const trainersApi = {
  getAllTrainers: () => axiosInstance.get("/trainers"),
  getTrainerById: (id) => axiosInstance.get(`/trainers/${id}`),
  getTrainerSchedule: (id) => axiosInstance.get(`/trainers/${id}/schedule`),
};
