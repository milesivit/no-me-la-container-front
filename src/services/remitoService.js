import api from "../services/api";

const remitoService = {
  getAll: () => api.get("/remito"),
  getById: (id) => api.get(`/remito/${id}`),
  create: (data) => api.post("/remito", data),
  update: (id, data) => api.put(`/remito/${id}`, data),
  remove: (id) => api.delete(`/remito/${id}`),
};

export default remitoService;
