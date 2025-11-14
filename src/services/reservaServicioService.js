import api from "../services/api";

const reservaServicioService = {
  getAll: () => api.get("/reservaservicio"),
  getById: (id) => api.get(`/reservaservicio/${id}`),
  create: (data) => api.post("/reservaservicio", data),
  update: (id, data) => api.put(`/reservaservicio/${id}`, data),
  remove: (id) => api.delete(`/reservaservicio/${id}`),
};

export default reservaServicioService;