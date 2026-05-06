import axiosInstance from "./axiosConfig";

export const chatbotApi = {
  // POST /api/chatbot/message  — Public
  // body: { message: "your message" }
  sendMessage: (message) => axiosInstance.post("/chatbot/message", { message }),

  // GET /api/chatbot/rules  — Admin only
  getRules: () => axiosInstance.get("/chatbot/rules"),

  // POST /api/chatbot/rules  — Admin only
  // body: { keywords: [], response, context, priority, isActive }
  addRule: (data) => axiosInstance.post("/chatbot/rules", data),

  // PUT /api/chatbot/rules/:id  — Admin only
  updateRule: (id, data) => axiosInstance.put(`/chatbot/rules/${id}`, data),

  // DELETE /api/chatbot/rules/:id  — Admin only
  deleteRule: (id) => axiosInstance.delete(`/chatbot/rules/${id}`),
};
