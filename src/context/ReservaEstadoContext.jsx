// src/context/reservaEstadoContext.jsx
import { createContext, useState, useEffect } from "react";
import reservaEstadoService from "../services/reservaEstadoService";
import { notifyError, notifySuccess } from "../utils/Notifier";

export const reservaEstadoContext = createContext();

export const reservaEstadoProvider = ({ children }) => {
  const [reservaEstados, setreservaEstados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedreservaEstado, setselectedreservaEstado] = useState(null);

  //obtener todos los reservaEstados
  const fetchReservaEstados = async () => {
    try {
      setLoading(true);
      const { data } = await reservaEstadoService.getAll();
      setreservaEstados(data.data || []);
    } catch (error) {
      notifyError("Error al cargar los reservaEstados");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  //crear reservaEstado
  const createReservaEstado = async (reservaEstadoData) => {
    try {
      const { data } = await reservaEstadoService.create(reservaEstadoData);
      setreservaEstados((prev) => [...prev, data.data]);
      notifySuccess("reservaEstado creado exitosamente");
    } catch (error) {
      notifyError(error.response?.data?.message || "Error al crear reservaEstado");
    }
  };

  // Editar reservaEstado
  const updateReservaEstado = async (id, reservaEstadoData) => {
    try {
      const { data } = await reservaEstadoService.update(id, reservaEstadoData);
      setreservaEstados((prev) =>
        prev.map((b) => (b.id === id ? data.data : b))
      );
      notifySuccess("reservaEstado actualizado exitosamente");
    } catch (error) {
      notifyError(error.response?.data?.message || "Error al actualizar reservaEstado");
    }
  };

  // Eliminar reservaEstado
  const deleteReservaEstado = async (id) => {
    try {
      await reservaEstadoService.remove(id);
      setreservaEstados((prev) => prev.filter((b) => b.id !== id));
      notifySuccess("reservaEstado eliminado exitosamente");
    } catch (error) {
      notifyError("Error al eliminar reservaEstado");
    }
  };

  useEffect(() => {
    fetchReservaEstados();
  }, []);

  return (
    <reservaEstadoContext.Provider
      value={{
        reservaEstados,
        loading,
        selectedreservaEstado,
        setselectedreservaEstado,
        fetchReservaEstados,
        createReservaEstado,
        updateReservaEstado,
        deleteReservaEstado,
      }}
    >
      {children}
    </reservaEstadoContext.Provider>
  );
};
