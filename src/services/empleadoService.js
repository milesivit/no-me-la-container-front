import api from "../services/api";

const empleadoService = {
  getAll: () => api.get("/empleado"),
  getById: (id) => api.get(`/empleado/${id}`),
  create: (data) => api.post("/empleado", data),
  update: (id, data) => api.put(`/empleado/${id}`, data),
  delete: (id) => api.delete(`/empleado/${id}`),
};

export default empleadoService;
