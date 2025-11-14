import { createContext, useState, useEffect } from "react";
import medioPagoService from "../services/medioPagoService";
import { notifyError, notifySuccess } from "../utils/Notifier";

export const MedioPagoContext = createContext();

export const MedioPagoProvider = ({ children }) => {
  const [mediosPago, setMediosPago] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMedioPago, setSelectedMedioPago] = useState(null);

  // Obtener todos
  const fetchMediosPago = async () => {
    try {
      setLoading(true);
      const { data } = await medioPagoService.getAll();
      setMediosPago(data.data || []);
    } catch (error) {
      notifyError("Error al cargar los medios de pago");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Crear
  const createMedioPago = async (medioPagoData) => {
    try {
      const { data } = await medioPagoService.create(medioPagoData);
      setMediosPago((prev) => [...prev, data.data]);
      notifySuccess("Medio de pago creado exitosamente");
    } catch (error) {
      notifyError(
        error.response?.data?.message || "Error al crear medio de pago"
      );
    }
  };

  // Actualizar
  const updateMedioPago = async (id, medioPagoData) => {
    try {
      const { data } = await medioPagoService.update(id, medioPagoData);
      setMediosPago((prev) =>
        prev.map((m) => (m.id === id ? data.data : m))
      );
      notifySuccess("Medio de pago actualizado exitosamente");
    } catch (error) {
      notifyError(
        error.response?.data?.message || "Error al actualizar medio de pago"
      );
    }
  };

  // Eliminar
  const deleteMedioPago = async (id) => {
    try {
      await medioPagoService.remove(id);
      setMediosPago((prev) => prev.filter((m) => m.id !== id));
      notifySuccess("Medio de pago eliminado exitosamente");
    } catch (error) {
      notifyError("Error al eliminar medio de pago");
    }
  };

  useEffect(() => {
    fetchMediosPago();
  }, []);

  return (
    <MedioPagoContext.Provider
      value={{
        mediosPago,
        loading,
        selectedMedioPago,
        setSelectedMedioPago,
        fetchMediosPago,
        createMedioPago,
        updateMedioPago,
        deleteMedioPago,
      }}
    >
      {children}
    </MedioPagoContext.Provider>
  );
};
