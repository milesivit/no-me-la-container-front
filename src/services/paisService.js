import api from "../services/api";

const paisService = {
  getAll: () => api.get("/pais"),
  getById: (id) => api.get(`/pais/${id}`),
  create: (data) => api.post("/pais", data),
  update: (id, data) => api.put(`/pais/${id}`, data),
  remove: (id) => api.delete(`/pais/${id}`),
};

export default paisService;
