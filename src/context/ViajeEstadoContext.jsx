// src/context/viajeEstadoContext.jsx
import { createContext, useState, useEffect } from "react";
import viajeEstadoService from "../services/viajeEstadoService";
import { notifyError, notifySuccess } from "../utils/Notifier";

export const ViajeEstadoContext = createContext();

export const viajeEstadoProvider = ({ children }) => {
  const [viajeEstados, setviajeEstados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedViajeEstado, setselectedViajeEstado] = useState(null);

  //obtener todos los viajeEstados
  const fetchViajeEstados = async () => {
    try {
      setLoading(true);
      const { data } = await viajeEstadoService.getAll();
      setviajeEstados(data.data || []);
    } catch (error) {
      notifyError("Error al cargar los viajeEstados");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  //crear viajeEstado
  const createViajeEstado = async (viajeEstadoData) => {
    try {
      const { data } = await viajeEstadoService.create(viajeEstadoData);
      setviajeEstados((prev) => [...prev, data.data]);
      notifySuccess("viajeEstado creado exitosamente");
    } catch (error) {
      notifyError(error.response?.data?.message || "Error al crear viajeEstado");
    }
  };

  // Editar viajeEstado
  const updateViajeEstado = async (id, viajeEstadoData) => {
    try {
      const { data } = await viajeEstadoService.update(id, viajeEstadoData);
      setviajeEstados((prev) =>
        prev.map((b) => (b.id === id ? data.data : b))
      );
      notifySuccess("viajeEstado actualizado exitosamente");
    } catch (error) {
      notifyError(error.response?.data?.message || "Error al actualizar viajeEstado");
    }
  };

  // Eliminar viajeEstado
  const deleteViajeEstado = async (id) => {
    try {
      await viajeEstadoService.remove(id);
      setviajeEstados((prev) => prev.filter((b) => b.id !== id));
      notifySuccess("viajeEstado eliminado exitosamente");
    } catch (error) {
      notifyError("Error al eliminar viajeEstado");
    }
  };

  useEffect(() => {
    fetchViajeEstados();
  }, []);

  return (
    <ViajeEstadoContext.Provider
      value={{
        viajeEstados,
        loading,
        selectedViajeEstado,
        setselectedViajeEstado,
        fetchViajeEstados,
        createViajeEstado,
        updateViajeEstado,
        deleteViajeEstado,
      }}
    >
      {children}
    </ViajeEstadoContext.Provider>
  );
};
