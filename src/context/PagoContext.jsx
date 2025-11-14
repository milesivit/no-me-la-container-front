import { createContext, useState, useEffect } from "react";
import pagoService from "../services/pagoService";
import { notifyError, notifySuccess } from "../utils/Notifier";

export const PagoContext = createContext();

export const PagoProvider = ({ children }) => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPago, setSelectedPago] = useState(null);

  // Obtener todos los pagos
  const fetchPagos = async () => {
    try {
      setLoading(true);
      const { data } = await pagoService.getAll();
      setPagos(data.data || []);
    } catch (error) {
      notifyError("Error al cargar los pagos");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Crear pago
  const createPago = async (pagoData) => {
    try {
      const { data } = await pagoService.create(pagoData);
      setPagos((prev) => [...prev, data.data]);
      notifySuccess("Pago creado exitosamente");
    } catch (error) {
      notifyError(
        error.response?.data?.message || "Error al crear el pago"
      );
    }
  };

  // Editar pago
  const updatePago = async (id, pagoData) => {
    try {
      const { data } = await pagoService.update(id, pagoData);
      setPagos((prev) =>
        prev.map((p) => (p.id === id ? data.data : p))
      );
      notifySuccess("Pago actualizado exitosamente");
    } catch (error) {
      notifyError(
        error.response?.data?.message || "Error al actualizar el pago"
      );
    }
  };

  // Eliminar pago
  const deletePago = async (id) => {
    try {
      await pagoService.remove(id);
      setPagos((prev) => prev.filter((p) => p.id !== id));
      notifySuccess("Pago eliminado exitosamente");
    } catch (error) {
      notifyError("Error al eliminar el pago");
    }
  };

  useEffect(() => {
    fetchPagos();
  }, []);

  return (
    <PagoContext.Provider
      value={{
        pagos,
        loading,
        selectedPago,
        setSelectedPago,
        fetchPagos,
        createPago,
        updatePago,
        deletePago,
      }}
    >
      {children}
    </PagoContext.Provider>
  );
};
