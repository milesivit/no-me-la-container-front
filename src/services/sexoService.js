import api from "../services/api";

const sexoService = {
  getAll: () => api.get("/sexo"),
  getById: (id) => api.get(`/sexo/${id}`),
  create: (data) => api.post("/sexo", data),
  update: (id, data) => api.put(`/sexo/${id}`, data),
  remove: (id) => api.delete(`/sexo/${id}`),
};

export default sexoService;
