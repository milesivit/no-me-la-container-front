import api from "../services/api";

const authService = {
  login: (credentials) => api.post("auth/login", credentials),
  register: (data) => api.post("auth/register", data),
  forgot: (correo) => {
    return api.post("auth/forgotPassword", { correo });
  },
  reset: (data) => {
    return api.post("auth/resetPassword", data);
  },
};

export default authService;
