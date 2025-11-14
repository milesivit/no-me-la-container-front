import { createContext, useState, useEffect } from "react";
import reservaViajeService from "../services/reservaViajeService";
import { notifyError, notifySuccess } from "../utils/Notifier";

export const ReservaViajeContext = createContext();

export const ReservaViajeProvider = ({ children }) => {
  const [reservaViajes, setReservaViajes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReservaViaje, setSelectedReservaViaje] = useState(null);

  // Obtener todos
  const fetchReservaViajes = async () => {
    try {
      setLoading(true);
      const { data } = await reservaViajeService.getAll();
      setReservaViajes(data.data || []);
    } catch (error) {
      notifyError("Error al cargar las reservas de viaje");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Crear
  const createReservaViaje = async (reservaViajeData) => {
    try {
      const { data } = await reservaViajeService.create(reservaViajeData);
      setReservaViajes((prev) => [...prev, data.data]);
      notifySuccess("Reserva de viaje creada exitosamente");
    } catch (error) {
      notifyError(
        error.response?.data?.message ||
          "Error al crear la reserva de viaje"
      );
    }
  };

  // Editar
  const updateReservaViaje = async (id, reservaViajeData) => {
    try {
      const { data } = await reservaViajeService.update(id, reservaViajeData);
      setReservaViajes((prev) =>
        prev.map((rv) => (rv.id === id ? data.data : rv))
      );
      notifySuccess("Reserva de viaje actualizada");
    } catch (error) {
      notifyError(
        error.response?.data?.message ||
          "Error al actualizar la reserva de viaje"
      );
    }
  };

  // Eliminar
  const deleteReservaViaje = async (id) => {
    try {
      await reservaViajeService.remove(id);
      setReservaViajes((prev) => prev.filter((rv) => rv.id !== id));
      notifySuccess("Reserva de viaje eliminada");
    } catch (error) {
      notifyError("Error al eliminar la reserva de viaje");
    }
  };

  useEffect(() => {
    fetchReservaViajes();
  }, []);

  return (
    <ReservaViajeContext.Provider
      value={{
        reservaViajes,
        loading,
        selectedReservaViaje,
        setSelectedReservaViaje,
        fetchReservaViajes,
        createReservaViaje,
        updateReservaViaje,
        deleteReservaViaje,
      }}
    >
      {children}
    </ReservaViajeContext.Provider>
  );
};
