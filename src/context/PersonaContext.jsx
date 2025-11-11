import { createContext, useState, useEffect } from "react";
import personaService from "../services/personaService";

export const PersonaContext = createContext();

export const PersonaProvider = ({ children }) => {
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPersonas = async () => {
    setLoading(true);
    try {
      const { data } = await personaService.getAll();
      console.log("fetchPersonas data:", data);
  
      // Asegurar que personas sea array
      setPersonas((prev) => [...(Array.isArray(prev) ? prev : []), data]);
    } catch (error) {
      console.error("Error al obtener personas:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const createPersona = async (nuevaPersona) => {
    try {
      const { data } = await personaService.create(nuevaPersona);
      setPersonas((prev) => [...(Array.isArray(prev) ? prev : []), data]);
      return data;
    } catch (error) {
      console.error("Error al crear persona:", error);
      const mensaje =
        error.response?.data?.message ||
        "No se pudo crear la persona. Intenta nuevamente.";
      throw mensaje;
    }
  };
  

  //Eliminar persona
  const deletePersona = async (id) => {
    try {
      await personaService.delete(id);
      setPersonas((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error al eliminar persona:", error);
    }
  };

  useEffect(() => {
    fetchPersonas();
  }, []);

  return (
    <PersonaContext.Provider
      value={{
        personas,
        loading,
        fetchPersonas,
        createPersona,
        deletePersona,
      }}
    >
      {children}
    </PersonaContext.Provider>
  );
};
