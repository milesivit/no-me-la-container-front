import api from "../services/api";

const medioPagoService = {
  getAll: () => api.get("/mediopago"),
  getById: (id) => api.get(`/mediopago/${id}`),
  create: (data) => api.post("/mediopago", data),
  update: (id, data) => api.put(`/mediopago/${id}`, data),
  remove: (id) => api.delete(`/mediopago/${id}`),
};

export default medioPagoService;
