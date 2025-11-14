// src/context/ReservaServicioContext.jsx
import { createContext, useState, useEffect } from "react";
import reservaServicioService from "../services/reservaServicioService";
import { notifyError, notifySuccess } from "../utils/Notifier";

export const ReservaServicioContext = createContext();

export const ReservaServicioProvider = ({ children }) => {
  const [reservaServicios, setReservaServicios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReservaServicio, setSelectedReservaServicio] = useState(null);

  // Obtener todas
  const fetchReservaServicios = async () => {
    try {
      setLoading(true);
      const { data } = await reservaServicioService.getAll();
      setReservaServicios(data.data || []);
    } catch (error) {
      notifyError("Error al cargar las reservas de servicio");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Crear
  const createReservaServicio = async (reservaData) => {
    try {
      const { data } = await reservaServicioService.create(reservaData);
      setReservaServicios((prev) => [...prev, data.data]);
      notifySuccess("Reserva de servicio creada exitosamente");
    } catch (error) {
      notifyError(
        error.response?.data?.message ||
          "Error al crear la reserva de servicio"
      );
    }
  };

  // Editar
  const updateReservaServicio = async (id, reservaData) => {
    try {
      const { data } = await reservaServicioService.update(id, reservaData);
      setReservaServicios((prev) =>
        prev.map((r) => (r.id === id ? data.data : r))
      );
      notifySuccess("Reserva de servicio actualizada correctamente");
    } catch (error) {
      notifyError(
        error.response?.data?.message ||
          "Error al actualizar la reserva de servicio"
      );
    }
  };

  // Eliminar
  const deleteReservaServicio = async (id) => {
    try {
      await reservaServicioService.remove(id);
      setReservaServicios((prev) => prev.filter((r) => r.id !== id));
      notifySuccess("Reserva de servicio eliminada exitosamente");
    } catch (error) {
      notifyError("Error al eliminar la reserva de servicio");
    }
  };

  useEffect(() => {
    fetchReservaServicios();
  }, []);

  return (
    <ReservaServicioContext.Provider
      value={{
        reservaServicios,
        loading,
        selectedReservaServicio,
        setSelectedReservaServicio,
        fetchReservaServicios,
        createReservaServicio,
        updateReservaServicio,
        deleteReservaServicio,
      }}
    >
      {children}
    </ReservaServicioContext.Provider>
  );
};
