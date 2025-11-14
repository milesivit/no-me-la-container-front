// src/context/FacturaContext.jsx
import { createContext, useState, useEffect } from "react";
import facturaService from "../services/facturaService";
import { notifyError, notifySuccess } from "../utils/Notifier";

export const FacturaContext = createContext();

export const FacturaProvider = ({ children }) => {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState(null);

  // Obtener todas las facturas
  const fetchFacturas = async () => {
    try {
      setLoading(true);
      const { data } = await facturaService.getAll();
      setFacturas(data.data || []);
    } catch (error) {
      notifyError("Error al cargar las facturas");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Crear factura
  const createFactura = async (facturaData) => {
    try {
      const { data } = await facturaService.create(facturaData);
      setFacturas((prev) => [...prev, data.data]);
      notifySuccess("Factura creada exitosamente");
    } catch (error) {
      notifyError(
        error.response?.data?.message || "Error al crear la factura"
      );
    }
  };

  // Editar factura
  const updateFactura = async (id, facturaData) => {
    try {
      const { data } = await facturaService.update(id, facturaData);
      setFacturas((prev) =>
        prev.map((f) => (f.id === id ? data.data : f))
      );
      notifySuccess("Factura actualizada correctamente");
    } catch (error) {
      notifyError(
        error.response?.data?.message || "Error al actualizar la factura"
      );
    }
  };

  // Eliminar factura
  const deleteFactura = async (id) => {
    try {
      await facturaService.remove(id);
      setFacturas((prev) => prev.filter((f) => f.id !== id));
      notifySuccess("Factura eliminada exitosamente");
    } catch (error) {
      notifyError("Error al eliminar la factura");
    }
  };

  useEffect(() => {
    fetchFacturas();
  }, []);

  return (
    <FacturaContext.Provider
      value={{
        facturas,
        loading,
        selectedFactura,
        setSelectedFactura,
        fetchFacturas,
        createFactura,
        updateFactura,
        deleteFactura,
      }}
    >
      {children}
    </FacturaContext.Provider>
  );
};
