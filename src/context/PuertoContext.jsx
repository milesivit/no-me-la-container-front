// src/context/PuertoContext.jsx
import { createContext, useState, useEffect } from "react";
import puertoService from "../services/puertoService";
import { notifyError, notifySuccess } from "../utils/Notifier";

export const PuertoContext = createContext();

export const PuertoProvider = ({ children }) => {
  const [puertos, setpuertos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedpuerto, setselectedpuerto] = useState(null);

  //obtener todos los puertos
  const fetchPuertos = async () => {
    try {
      setLoading(true);
      const { data } = await puertoService.getAll();
      setpuertos(data.data || []);
    } catch (error) {
      notifyError("Error al cargar los puertos");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  //crear puerto
  const createPuerto = async (puertoData) => {
    try {
      const { data } = await puertoService.create(puertoData);
      setpuertos((prev) => [...prev, data.data]);
      notifySuccess("puerto creado exitosamente");
    } catch (error) {
      notifyError(error.response?.data?.message || "Error al crear puerto");
    }
  };

  // Editar puerto
  const updatePuerto = async (id, puertoData) => {
    try {
      const { data } = await puertoService.update(id, puertoData);
      setpuertos((prev) =>
        prev.map((b) => (b.id === id ? data.data : b))
      );
      notifySuccess("puerto actualizado exitosamente");
    } catch (error) {
      notifyError(error.response?.data?.message || "Error al actualizar puerto");
    }
  };

  // Eliminar puerto
  const deletePuerto = async (id) => {
    try {
      await puertoService.remove(id);
      setpuertos((prev) => prev.filter((b) => b.id !== id));
      notifySuccess("puerto eliminado exitosamente");
    } catch (error) {
      notifyError("Error al eliminar puerto");
    }
  };

  useEffect(() => {
    fetchPuertos();
  }, []);

  return (
    <PuertoContext.Provider
      value={{
        puertos,
        loading,
        selectedpuerto,
        setselectedpuerto,
        fetchPuertos,
        createPuerto,
        updatePuerto,
        deletePuerto,
      }}
    >
      {children}
    </PuertoContext.Provider>
  );
};
