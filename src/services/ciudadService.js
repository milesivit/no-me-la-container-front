import api from "../services/api";

const ciudadService = {
  getAll: () => api.get("/ciudad"),
  getById: (id) => api.get(`/ciudad/${id}`),
  create: (data) => api.post("/ciudad", data),
  update: (id, data) => api.put(`/ciudad/${id}`, data),
  remove: (id) => api.delete(`/ciudad/${id}`),
};

export default ciudadService;
