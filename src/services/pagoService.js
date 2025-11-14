import api from "../services/api";

const pagoService = {
  getAll: () => api.get("/pago"),
  getById: (id) => api.get(`/pago/${id}`),
  create: (data) => api.post("/pago", data),
  update: (id, data) => api.put(`/pago/${id}`, data),
  remove: (id) => api.delete(`/pago/${id}`),
};

export default pagoService;
