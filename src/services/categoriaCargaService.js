import api from "../services/api";

const categoriaCargaService = {
  getAll: () => api.get("/categoriacarga"),
  getById: (id) => api.get(`/categoriacarga/${id}`),
  create: (data) => api.post("/categoriacarga", data),
  update: (id, data) => api.put(`/categoriacarga/${id}`, data),
  remove: (id) => api.delete(`/categoriacarga/${id}`),
};

export default categoriaCargaService;
