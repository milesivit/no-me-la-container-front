import api from "../services/api";

const impuestoService = {
  getAll: () => api.get("/impuesto"),
  getById: (id) => api.get(`/impuesto/${id}`),
  create: (data) => api.post("/impuesto", data),
  update: (id, data) => api.put(`/impuesto/${id}`, data),
  remove: (id) => api.delete(`/impuesto/${id}`),
};

export default impuestoService;
