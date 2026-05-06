// Central export — import anything from "../api"
// Usage: import { authApi, membershipsApi } from "../api";

export { authApi }        from "./authApi";
export { usersApi }       from "./usersApi";
export { membershipsApi } from "./membershipsApi";
export { trainersApi }    from "./trainersApi";
export { sessionsApi }    from "./sessionsApi";
export { adminApi }       from "./adminApi";
export { chatbotApi }     from "./chatbotApi";
export { default as axiosInstance } from "./axiosConfig";
