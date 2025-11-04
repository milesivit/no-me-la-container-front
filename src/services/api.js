import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 10000,
})

api.interceptors.request.use(
    (config) =>{
        const token= localStorage.getItem('token')
        if(token) config.headers.Authorization= `Bearer ${token}`
        return config 
    },
    (error) => Promise.reject(error)
)

api.interceptors.response.use(
    (res) => res,
    (error) => {
      const status = error?.response?.status;
  
      if (status === 401) {
        localStorage.removeItem("token");
      }
  
      if (error.response) {
        // Error que viene del servidor
        console.error("Error en la API:", error.response.data);
      } else if (error.request) {
        // No hubo respuesta del servidor
        console.error("No se recibió respuesta del servidor:", error.request);
      } else {
        // Error al armar la request
        console.error("Error al configurar la request:", error.message);
      }
  
      return Promise.reject(error);
    }
  );
  

export default api