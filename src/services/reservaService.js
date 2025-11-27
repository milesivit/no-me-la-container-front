import api from "../services/api";

const reservaService = {
  getAll: () => api.get("/reserva"),
  getById: (id) => api.get(`/reserva/${id}`),
  create: (data) => api.post("/reserva", data),
  update: (id, data) => api.put(`/reserva/${id}`, data),
  remove: (id) => api.delete(`/reserva/${id}`),
  getFacturaByReserva: (id) => api.get(`/reserva/${id}/factura`),

};

export default reservaService;
