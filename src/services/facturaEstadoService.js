// src/services/facturaEstado.service.js
import api from "../services/api";

const facturaEstadoService = {
  getAll: () => api.get("/facturaestado"),
  getById: (id) => api.get(`/facturaestado/${id}`),
  create: (data) => api.post("/facturaestado", data),
  update: (id, data) => api.put(`/facturaestado/${id}`, data),
  remove: (id) => api.delete(`/facturaestado/${id}`),
};

export default facturaEstadoService;
