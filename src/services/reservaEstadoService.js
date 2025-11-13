import api from "../services/api";

const reservaEstadoService = {
  getAll: () => api.get("/reservaestado"),
  getById: (id) => api.get(`/reservaestado/${id}`),
  create: (data) => api.post("/reservaestado", data),
  update: (id, data) => api.put(`/reservaestado/${id}`, data),
  remove: (id) => api.delete(`/reservaestado/${id}`),
};

export default reservaEstadoService;
