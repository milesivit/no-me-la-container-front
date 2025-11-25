import { createContext, useState, useEffect } from "react";
import reservaService from "../services/reservaService";
import { notifyError, notifySuccess } from "../utils/Notifier";

export const ReservaContext = createContext();

export const ReservaProvider = ({ children }) => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState(null);

  // Obtener todas las reservas
  const fetchReservas = async () => {
    try {
      setLoading(true);
      const { data } = await reservaService.getAll();
      setReservas(data.data || []);
    } catch (error) {
      notifyError("Error al cargar las reservas");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Crear reserva
  const createReserva = async (reservaData) => {
    try {
      const { data } = await reservaService.create(reservaData);
      setReservas((prev) => [...prev, data.data]);
      notifySuccess("Reserva creada exitosamente");
      return data.data;
    } catch (error) {
      notifyError(
        error.response?.data?.message || "Error al crear la reserva"
      );
    }
  };

  // Editar reserva
  const updateReserva = async (id, reservaData) => {
    try {
      const { data } = await reservaService.update(id, reservaData);
      setReservas((prev) =>
        prev.map((r) => (r.id === id ? data.data : r))
      );
      notifySuccess("Reserva actualizada correctamente");
    } catch (error) {
      notifyError(
        error.response?.data?.message || "Error al actualizar la reserva"
      );
    }
  };

  // Eliminar reserva
  const deleteReserva = async (id) => {
    try {
      await reservaService.remove(id);
      setReservas((prev) => prev.filter((r) => r.id !== id));
      notifySuccess("Reserva eliminada exitosamente");
    } catch (error) {
      notifyError("Error al eliminar la reserva");
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  return (
    <ReservaContext.Provider
      value={{
        reservas,
        loading,
        selectedReserva,
        setSelectedReserva,
        fetchReservas,
        createReserva,
        updateReserva,
        deleteReserva,
      }}
    >
      {children}
    </ReservaContext.Provider>
  );
};
