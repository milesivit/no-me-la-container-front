import api from "../services/api";

const viajeContainerService = {
  getAll: () => api.get("/viajecontainer"),
  getById: (id) => api.get(`/viajecontainer/${id}`),
  create: (data) => api.post("/viajecontainer", data),
  update: (id, data) => api.put(`/viajecontainer/${id}`, data),
  remove: (id) => api.delete(`/viajecontainer/${id}`),
};

export default viajeContainerService;
