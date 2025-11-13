import api from "../services/api";

const puertoService = {
  getAll: () => api.get("/puerto"),
  getById: (id) => api.get(`/puerto/${id}`),
  create: (data) => api.post("/puerto", data),
  update: (id, data) => api.put(`/puerto/${id}`, data),
  remove: (id) => api.delete(`/puerto/${id}`),
};

export default puertoService;
