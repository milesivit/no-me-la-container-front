import { createContext, useState, useEffect, useContext } from "react";
import reservaService from "../services/reservaService";
import { notifyError, notifySuccess } from "../utils/Notifier";
import { AuthContext } from "../context/AuthContext";

export const ReservaContext = createContext();

export const ReservaProvider = ({ children }) => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState(null);
  const { user } = useContext(AuthContext);


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

  // obtener factura mediante reserva
  const getFacturaByReserva = async (id) => {
    try {
      const { data } = await reservaService.getFacturaByReserva(id);
      return data.data;
    } catch (error) {
      notifyError("No se pudo obtener la factura de la reserva");
    }
  };

  const fetchReservasCliente = async (clienteId) => {
    try {
      setLoading(true);
      const { data } = await reservaService.getByCliente(clienteId);
      setReservas(data.data || []);
    } catch (error) {
      notifyError("Error al cargar tus reservas");
    } finally {
      setLoading(false);
    }
  };
  
  
  useEffect(() => {
    if (user?.rol === "admin" || user?.rol === "moderador") {
        fetchReservas();
    }
  }, [user]);
  

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
        getFacturaByReserva,
        fetchReservasCliente
      }}
    >
      {children}
    </ReservaContext.Provider>
  );
};
