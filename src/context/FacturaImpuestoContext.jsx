// src/context/FacturaImpuestoContext.jsx
import { createContext, useState, useEffect } from "react";
import facturaImpuestoService from "../services/facturaImpuesto.service";
import { notifyError, notifySuccess } from "../utils/Notifier";

export const FacturaImpuestoContext = createContext();

export const FacturaImpuestoProvider = ({ children }) => {
  const [facturaImpuestos, setFacturaImpuestos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFacturaImpuesto, setSelectedFacturaImpuesto] = useState(null);

  // Obtener todos
  const fetchFacturaImpuestos = async () => {
    try {
      setLoading(true);
      const { data } = await facturaImpuestoService.getAll();
      setFacturaImpuestos(data.data || []);
    } catch (error) {
      notifyError("Error al cargar los impuestos de factura");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Crear
  const createFacturaImpuesto = async (impuestoData) => {
    try {
      const { data } = await facturaImpuestoService.create(impuestoData);
      setFacturaImpuestos((prev) => [...prev, data.data]);
      notifySuccess("Impuesto de factura creado exitosamente");
    } catch (error) {
      notifyError(
        error.response?.data?.message ||
          "Error al crear el impuesto de factura"
      );
    }
  };

  // Editar
  const updateFacturaImpuesto = async (id, impuestoData) => {
    try {
      const { data } = await facturaImpuestoService.update(id, impuestoData);
      setFacturaImpuestos((prev) =>
        prev.map((i) => (i.id === id ? data.data : i))
      );
      notifySuccess("Impuesto de factura actualizado correctamente");
    } catch (error) {
      notifyError(
        error.response?.data?.message ||
          "Error al actualizar el impuesto de factura"
      );
    }
  };

  // Eliminar
  const deleteFacturaImpuesto = async (id) => {
    try {
      await facturaImpuestoService.remove(id);
      setFacturaImpuestos((prev) => prev.filter((i) => i.id !== id));
      notifySuccess("Impuesto de factura eliminado exitosamente");
    } catch (error) {
      notifyError("Error al eliminar el impuesto de factura");
    }
  };

  useEffect(() => {
    fetchFacturaImpuestos();
  }, []);

  return (
    <FacturaImpuestoContext.Provider
      value={{
        facturaImpuestos,
        loading,
        selectedFacturaImpuesto,
        setSelectedFacturaImpuesto,
        fetchFacturaImpuestos,
        createFacturaImpuesto,
        updateFacturaImpuesto,
        deleteFacturaImpuesto,
      }}
    >
      {children}
    </FacturaImpuestoContext.Provider>
  );
};
