import api from "../services/api";

const cargaContainerService = {
  getAll: () => api.get("/cargacontainer"),
  getById: (id) => api.get(`/cargacontainer/${id}`),
  create: (data) => api.post("/cargacontainer", data),
  update: (id, data) => api.put(`/cargacontainer/${id}`, data),
  remove: (id) => api.delete(`/cargacontainer/${id}`),
};

export default cargaContainerService;
