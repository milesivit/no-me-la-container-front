import api from "../services/api";

const containerEstadoService = {
  getAll: () => api.get("/containerestado"),
  getById: (id) => api.get(`/containerestado/${id}`),
  create: (data) => api.post("/containerestado", data),
  update: (id, data) => api.put(`/containerestado/${id}`, data),
  remove: (id) => api.delete(`/containerestado/${id}`),
};

export default containerEstadoService;
