// src/context/FacturaEstadoContext.jsx
import { createContext, useState, useEffect } from "react";
import facturaEstadoService from "../services/facturaEstadoService";
import { notifyError, notifySuccess } from "../utils/Notifier";

export const FacturaEstadoContext = createContext();

export const FacturaEstadoProvider = ({ children }) => {
  const [facturaEstados, setFacturaEstados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFacturaEstado, setSelectedFacturaEstado] = useState(null);

  // Obtener todos los estados de factura
  const fetchFacturaEstados = async () => {
    try {
      setLoading(true);
      const { data } = await facturaEstadoService.getAll();
      setFacturaEstados(data.data || []);
    } catch (error) {
      notifyError("Error al cargar los estados de factura");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Crear estado
  const createFacturaEstado = async (estadoData) => {
    try {
      const { data } = await facturaEstadoService.create(estadoData);
      setFacturaEstados((prev) => [...prev, data.data]);
      notifySuccess("Estado de factura creado exitosamente");
    } catch (error) {
      notifyError(
        error.response?.data?.message ||
          "Error al crear el estado de factura"
      );
    }
  };

  // Editar estado
  const updateFacturaEstado = async (id, estadoData) => {
    try {
      const { data } = await facturaEstadoService.update(id, estadoData);
      setFacturaEstados((prev) =>
        prev.map((e) => (e.id === id ? data.data : e))
      );
      notifySuccess("Estado de factura actualizado correctamente");
    } catch (error) {
      notifyError(
        error.response?.data?.message ||
          "Error al actualizar el estado de factura"
      );
    }
  };

  // Eliminar estado
  const deleteFacturaEstado = async (id) => {
    try {
      await facturaEstadoService.remove(id);
      setFacturaEstados((prev) => prev.filter((e) => e.id !== id));
      notifySuccess("Estado de factura eliminado exitosamente");
    } catch (error) {
      notifyError("Error al eliminar el estado de factura");
    }
  };

  useEffect(() => {
    fetchFacturaEstados();
  }, []);

  return (
    <FacturaEstadoContext.Provider
      value={{
        facturaEstados,
        loading,
        selectedFacturaEstado,
        setSelectedFacturaEstado,
        fetchFacturaEstados,
        createFacturaEstado,
        updateFacturaEstado,
        deleteFacturaEstado,
      }}
    >
      {children}
    </FacturaEstadoContext.Provider>
  );
};
