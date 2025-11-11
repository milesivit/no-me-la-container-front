import api from "../services/api";

const cargoService = {
  getAll: () => api.get("/cargo"),
  getById: (id) => api.get(`/cargo/${id}`),
  create: (data) => api.post("/cargo", data),
  update: (id, data) => api.put(`/cargo/${id}`, data),
  remove: (id) => api.delete(`/cargo/${id}`),
};

export default cargoService;
