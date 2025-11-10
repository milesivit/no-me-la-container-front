import api from "../services/api";

const barcoService = {
  getAll: () => api.get("/barco"),
  getById: (id) => api.get(`/barco/${id}`),
  create: (data) => api.post("/barco", data),
  update: (id, data) => api.put(`/barco/${id}`, data),
  remove: (id) => api.delete(`/barco/${id}`),
};

export default barcoService;
