// src/services/servicioAgregado.service.js
import api from "../services/api";

const servicioAgregadoService = {
  getAll: () => api.get("/servicioagregado"),
  getById: (id) => api.get(`/servicioagregado/${id}`),
  create: (data) => api.post("/servicioagregado", data),
  update: (id, data) => api.put(`/servicioagregado/${id}`, data),
  remove: (id) => api.delete(`/servicioagregado/${id}`),
};

export default servicioAgregadoService;
