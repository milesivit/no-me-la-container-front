import { createContext, useState, useEffect } from "react";
import ciudadService from "../services/ciudadService";
import { notifyError, notifySuccess } from "../utils/Notifier";

export const CiudadContext = createContext();

export const CiudadProvider = ({ children }) => {
  const [ciudades, setCiudades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCiudad, setSelectedCiudad] = useState(null);

  // Obtener todas las ciudades
  const fetchCiudades = async () => {
    try {
      setLoading(true);
      const { data } = await ciudadService.getAll();
      setCiudades(data.data || []);
    } catch (error) {
      notifyError("Error al cargar las ciudades");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Crear ciudad
  const createCiudad = async (ciudadData) => {
    try {
      const { data } = await ciudadService.create(ciudadData);
      setCiudades((prev) => [...prev, data.data]);
      notifySuccess("Ciudad creada exitosamente");
    } catch (error) {
      notifyError(
        error.response?.data?.message || "Error al crear la ciudad"
      );
    }
  };

  // Editar ciudad
  const updateCiudad = async (id, ciudadData) => {
    try {
      const { data } = await ciudadService.update(id, ciudadData);
      setCiudades((prev) =>
        prev.map((c) => (c.id === id ? data.data : c))
      );
      notifySuccess("Ciudad actualizada exitosamente");
    } catch (error) {
      notifyError(
        error.response?.data?.message || "Error al actualizar la ciudad"
      );
    }
  };

  // Eliminar ciudad
  const deleteCiudad = async (id) => {
    try {
      await ciudadService.remove(id);
      setCiudades((prev) => prev.filter((c) => c.id !== id));
      notifySuccess("Ciudad eliminada exitosamente");
    } catch (error) {
      notifyError("Error al eliminar la ciudad");
    }
  };

  useEffect(() => {
    fetchCiudades();
  }, []);

  return (
    <CiudadContext.Provider
      value={{
        ciudades,
        loading,
        selectedCiudad,
        setSelectedCiudad,
        fetchCiudades,
        createCiudad,
        updateCiudad,
        deleteCiudad,
      }}
    >
      {children}
    </CiudadContext.Provider>
  );
};
