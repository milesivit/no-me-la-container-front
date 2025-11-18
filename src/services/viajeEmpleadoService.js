import api from "../services/api";

const viajeEmpleadoService = {
  getAll: () => api.get("/viajeempleado"),
  getById: (id) => api.get(`/viajeempleado/${id}`),
  getByEmpleado: (empleadoId) => api.get(`/viajeempleado/empleado/${empleadoId}`),
  create: (data) => api.post("/viajeempleado", data),
  update: (id, data) => api.put(`/viajeempleado/${id}`, data),
  remove: (id) => api.delete(`/viajeempleado/${id}`),
};

export default viajeEmpleadoService;
