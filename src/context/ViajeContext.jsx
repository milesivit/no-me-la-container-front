import { createContext, useState, useEffect } from "react";
import viajeService from "../services/viajeService";
import { notifyError, notifySuccess } from "../utils/Notifier";

export const ViajeContext = createContext();

export const ViajeProvider = ({ children }) => {
  const [viajes, setViajes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedViaje, setSelectedViaje] = useState(null);

  // Obtener todos los viajes
  const fetchViajes = async () => {
    try {
      setLoading(true);
      const { data } = await viajeService.getAll();
      setViajes(data.data || []);
    } catch (error) {
      notifyError("Error al cargar los viajes");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Crear viaje
  const createViaje = async (viajeData) => {
    try {
      const { data } = await viajeService.create(viajeData);
      setViajes((prev) => [...prev, data.data]);
      notifySuccess("Viaje creado exitosamente");
    } catch (error) {
      notifyError(
        error.response?.data?.message || "Error al crear viaje"
      );
    }
  };

  // Editar viaje
  const updateViaje = async (id, viajeData) => {
    try {
      const { data } = await viajeService.update(id, viajeData);
      setViajes((prev) =>
        prev.map((v) => (v.id === id ? data.data : v))
      );
      notifySuccess("Viaje actualizado exitosamente");
    } catch (error) {
      notifyError(
        error.response?.data?.message || "Error al actualizar viaje"
      );
    }
  };

  // Eliminar viaje
  const deleteViaje = async (id) => {
    try {
      await viajeService.remove(id);
      setViajes((prev) => prev.filter((v) => v.id !== id));
      notifySuccess("Viaje eliminado exitosamente");
    } catch (error) {
      notifyError("Error al eliminar viaje");
    }
  };

  useEffect(() => {
    fetchViajes();
  }, []);

  return (
    <ViajeContext.Provider
      value={{
        viajes,
        loading,
        selectedViaje,
        setSelectedViaje,
        fetchViajes,
        createViaje,
        updateViaje,
        deleteViaje,
      }}
    >
      {children}
    </ViajeContext.Provider>
  );
};
