import api from "../services/api";

const viajeEstadoService = {
  getAll: () => api.get("/viajeestado"),
  getById: (id) => api.get(`/viajeestado/${id}`),
  create: (data) => api.post("/viajeestado", data),
  update: (id, data) => api.put(`/viajeestado/${id}`, data),
  remove: (id) => api.delete(`/viajeestado/${id}`),
};

export default viajeEstadoService;
