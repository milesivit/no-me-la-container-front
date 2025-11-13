import api from "../services/api";

const ViajeService = {
  getAll: () => api.get("/viaje"),
  getById: (id) => api.get(`/viaje/${id}`),
  create: (data) => api.post("/viaje", data),
  update: (id, data) => api.put(`/viaje/${id}`, data),
  remove: (id) => api.delete(`/viaje/${id}`),
};

export default ViajeService;
