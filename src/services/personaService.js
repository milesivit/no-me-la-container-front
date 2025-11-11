import api from "../services/api";

const personaService = {
  getAll: () => api.get("/persona"),
  getById: (id) => api.get(`/persona/${id}`),
  create: (data) => api.post("/persona", data),
  update: (id, data) => api.put(`/persona/${id}`, data),
  delete: (id) => api.delete(`/persona/${id}`),
};

export default personaService;
