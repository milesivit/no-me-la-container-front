import api from "../services/api";

const razonSocialService = {
  getAll: () => api.get("/razonsocial"),
  getById: (id) => api.get(`/razonsocial/${id}`),
  create: (data) => api.post("/razonsocial", data),
  update: (id, data) => api.put(`/razonsocial/${id}`, data),
  remove: (id) => api.delete(`/razonsocial/${id}`),
};

export default razonSocialService;
