import axiosInstance from "./axiosConfig";

export const chatbotApi = {
  sendMessage: (message) => axiosInstance.post("/chatbot/message", { message }),
  getRules: () => axiosInstance.get("/chatbot/rules"),
};
