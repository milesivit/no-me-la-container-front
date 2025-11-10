// src/context/BarcoContext.jsx
import { createContext, useState, useEffect } from "react";
import barcoService from "../services/barcoService";
import { notifyError, notifySuccess } from "../utils/Notifier";

export const BarcoContext = createContext();

export const BarcoProvider = ({ children }) => {
  const [barcos, setBarcos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBarco, setSelectedBarco] = useState(null);

  //obtener todos los barcos
  const fetchBarcos = async () => {
    try {
      setLoading(true);
      const { data } = await barcoService.getAll();
      setBarcos(data.data || []);
    } catch (error) {
      notifyError("Error al cargar los barcos");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  //crear barco
  const createBarco = async (barcoData) => {
    try {
      const { data } = await barcoService.create(barcoData);
      setBarcos((prev) => [...prev, data.data]);
      notifySuccess("Barco creado exitosamente");
    } catch (error) {
      notifyError(error.response?.data?.message || "Error al crear barco");
    }
  };

  // Editar barco
  const updateBarco = async (id, barcoData) => {
    try {
      const { data } = await barcoService.update(id, barcoData);
      setBarcos((prev) =>
        prev.map((b) => (b.id === id ? data.data : b))
      );
      notifySuccess("Barco actualizado exitosamente");
    } catch (error) {
      notifyError(error.response?.data?.message || "Error al actualizar barco");
    }
  };

  // Eliminar barco
  const deleteBarco = async (id) => {
    try {
      await barcoService.remove(id);
      setBarcos((prev) => prev.filter((b) => b.id !== id));
      notifySuccess("Barco eliminado exitosamente");
    } catch (error) {
      notifyError("Error al eliminar barco");
    }
  };

  useEffect(() => {
    fetchBarcos();
  }, []);

  return (
    <BarcoContext.Provider
      value={{
        barcos,
        loading,
        selectedBarco,
        setSelectedBarco,
        fetchBarcos,
        createBarco,
        updateBarco,
        deleteBarco,
      }}
    >
      {children}
    </BarcoContext.Provider>
  );
};
