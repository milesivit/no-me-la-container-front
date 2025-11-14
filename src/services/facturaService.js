// src/services/factura.service.js
import api from "../services/api";

const facturaService = {
  getAll: () => api.get("/factura"),
  getById: (id) => api.get(`/factura/${id}`),
  create: (data) => api.post("/factura", data),
  update: (id, data) => api.put(`/factura/${id}`, data),
  remove: (id) => api.delete(`/factura/${id}`),
};

export default facturaService;
