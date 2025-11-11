import api from "../services/api";

const clienteService = {
  getAll: () => api.get("/cliente"),
  getById: (id) => api.get(`/cliente/${id}`),
  create: (data) => api.post("/cliente", data),
  update: (id, data) => api.put(`/cliente/${id}`, data),
  delete: (id) => api.delete(`/cliente/${id}`),
};

export default clienteService;
