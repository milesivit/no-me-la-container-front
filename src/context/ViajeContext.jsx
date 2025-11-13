// src/context/viajeContext.jsx
import { createContext, useState, useEffect } from "react";
import viajeService from "../services/viajeService";
import { notifyError, notifySuccess } from "../utils/Notifier";

export const viajeContext = createContext();

export const ViajeProvider = ({ children }) => {
  const [viajes, setviajes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedviaje, setselectedviaje] = useState(null);

  //obtener todos los viajes
  const fetchviajes = async () => {
    try {
      setLoading(true);
      const { data } = await viajeService.getAll();
      setviajes(data.data || []);
    } catch (error) {
      notifyError("Error al cargar los viajes");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  //crear viaje
  const createviaje = async (viajeData) => {
    try {
      const { data } = await viajeService.create(viajeData);
      setviajes((prev) => [...prev, data.data]);
      notifySuccess("viaje creado exitosamente");
    } catch (error) {
      notifyError(error.response?.data?.message || "Error al crear viaje");
    }
  };

  // Editar viaje
  const updateviaje = async (id, viajeData) => {
    try {
      const { data } = await viajeService.update(id, viajeData);
      setviajes((prev) =>
        prev.map((b) => (b.id === id ? data.data : b))
      );
      notifySuccess("viaje actualizado exitosamente");
    } catch (error) {
      notifyError(error.response?.data?.message || "Error al actualizar viaje");
    }
  };

  // Eliminar viaje
  const deleteviaje = async (id) => {
    try {
      await viajeService.remove(id);
      setviajes((prev) => prev.filter((b) => b.id !== id));
      notifySuccess("viaje eliminado exitosamente");
    } catch (error) {
      notifyError("Error al eliminar viaje");
    }
  };

  useEffect(() => {
    fetchviajes();
  }, []);

  return (
    <viajeContext.Provider
      value={{
        viajes,
        loading,
        selectedviaje,
        setselectedviaje,
        fetchviajes,
        createviaje,
        updateviaje,
        deleteviaje,
      }}
    >
      {children}
    </viajeContext.Provider>
  );
};
