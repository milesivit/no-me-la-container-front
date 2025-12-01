import api from "../services/api";

const cargaContainerService = {
  getAll: () => api.get("/cargacontainer"),
  getById: (id) => api.get(`/cargacontainer/${id}`),
  create: (data) => api.post("/cargacontainer", data).then(res => {
    console.log("RESPUESTA DEL BACK:", res);
    return res;
  }),
  update: (id, data) => api.put(`/cargacontainer/${id}`, data),
  remove: (id) => api.delete(`/cargacontainer/${id}`),
};

export default cargaContainerService;
