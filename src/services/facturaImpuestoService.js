// src/services/facturaImpuesto.service.js
import api from "../services/api";

const facturaImpuestoService = {
  getAll: () => api.get("/facturaimpuesto"),
  getById: (id) => api.get(`/facturaimpuesto/${id}`),
  create: (data) => api.post("/facturaimpuesto", data),
  update: (id, data) => api.put(`/facturaimpuesto/${id}`, data),
  remove: (id) => api.delete(`/facturaimpuesto/${id}`),
};

export default facturaImpuestoService;
