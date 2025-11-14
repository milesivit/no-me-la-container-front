import api from "../services/api";

const containerService = {
  getAll: () => api.get("/container"),
  getById: (id) => api.get(`/container/${id}`),
  create: (data) => api.post("/container", data),
  update: (id, data) => api.put(`/container/${id}`, data),
  remove: (id) => api.delete(`/container/${id}`),
};

export default containerService;
