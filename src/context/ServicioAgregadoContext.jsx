// src/context/ServicioAgregadoContext.jsx
import { createContext, useState, useEffect } from "react";
import servicioAgregadoService from "../services/servicioAgregadoService";
import { notifyError, notifySuccess } from "../utils/Notifier";

export const ServicioAgregadoContext = createContext();

export const ServicioAgregadoProvider = ({ children }) => {
  const [serviciosAgregados, setServiciosAgregados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedServicioAgregado, setSelectedServicioAgregado] = useState(null);

  // Obtener todos
  const fetchServiciosAgregados = async () => {
    try {
      setLoading(true);
      const { data } = await servicioAgregadoService.getAll();
      setServiciosAgregados(data.data || []);
    } catch (error) {
      notifyError("Error al cargar los servicios agregados");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Crear
  const createServicioAgregado = async (servicioData) => {
    try {
      const { data } = await servicioAgregadoService.create(servicioData);
      setServiciosAgregados((prev) => [...prev, data.data]);
      notifySuccess("Servicio agregado creado exitosamente");
    } catch (error) {
      notifyError(
        error.response?.data?.message || "Error al crear el servicio agregado"
      );
    }
  };

  // Editar
  const updateServicioAgregado = async (id, servicioData) => {
    try {
      const { data } = await servicioAgregadoService.update(id, servicioData);
      setServiciosAgregados((prev) =>
        prev.map((s) => (s.id === id ? data.data : s))
      );
      notifySuccess("Servicio agregado actualizado correctamente");
    } catch (error) {
      notifyError(
        error.response?.data?.message ||
          "Error al actualizar el servicio agregado"
      );
    }
  };

  // Eliminar
  const deleteServicioAgregado = async (id) => {
    try {
      await servicioAgregadoService.remove(id);
      setServiciosAgregados((prev) => prev.filter((s) => s.id !== id));
      notifySuccess("Servicio agregado eliminado exitosamente");
    } catch (error) {
      notifyError("Error al eliminar el servicio agregado");
    }
  };

  useEffect(() => {
    fetchServiciosAgregados();
  }, []);

  return (
    <ServicioAgregadoContext.Provider
      value={{
        serviciosAgregados,
        loading,
        selectedServicioAgregado,
        setSelectedServicioAgregado,
        fetchServiciosAgregados,
        createServicioAgregado,
        updateServicioAgregado,
        deleteServicioAgregado,
      }}
    >
      {children}
    </ServicioAgregadoContext.Provider>
  );
};
