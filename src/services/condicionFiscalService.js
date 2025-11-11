import api from "../services/api";

const condicionFiscalService = {
  getAll: () => api.get("/condicionfiscal"),
  getById: (id) => api.get(`/condicionfiscal/${id}`),
  create: (data) => api.post("/condicionfiscal", data),
  update: (id, data) => api.put(`/condicionfiscal/${id}`, data),
  remove: (id) => api.delete(`/condicionfiscal/${id}`),
};

export default condicionFiscalService;
