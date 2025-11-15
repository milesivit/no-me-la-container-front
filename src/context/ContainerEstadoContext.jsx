// src/context/ContainerEstadoContext.jsx
import { createContext, useState, useEffect } from "react";
import containerEstadoService from "../services/containerEstadoService";
import { notifyError, notifySuccess } from "../utils/Notifier";

export const ContainerEstadoContext = createContext();

export const ContainerEstadoProvider = ({ children }) => {
  const [containerEstados, setcontainerEstados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedcontainerEstado, setselectedcontainerEstado] = useState(null);

  //obtener todos los containerEstados
  const fetchContainerEstados = async () => {
    try {
      setLoading(true);
      const { data } = await containerEstadoService.getAll();
      setcontainerEstados(data.data || []);
    } catch (error) {
      notifyError("Error al cargar los containerEstados");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  //crear containerEstado
  const createContainerEstado = async (containerEstadoData) => {
    try {
      const { data } = await containerEstadoService.create(containerEstadoData);
      setcontainerEstados((prev) => [...prev, data.data]);
      notifySuccess("containerEstado creado exitosamente");
    } catch (error) {
      notifyError(error.response?.data?.message || "Error al crear containerEstado");
    }
  };

  // Editar containerEstado
  const updatecontainerEstado = async (id, containerEstadoData) => {
    try {
      const { data } = await containerEstadoService.update(id, containerEstadoData);
      setcontainerEstados((prev) =>
        prev.map((b) => (b.id === id ? data.data : b))
      );
      notifySuccess("containerEstado actualizado exitosamente");
    } catch (error) {
      notifyError(error.response?.data?.message || "Error al actualizar containerEstado");
    }
  };

  // Eliminar containerEstado
  const deleteContainerEstado = async (id) => {
    try {
      await containerEstadoService.remove(id);
      setcontainerEstados((prev) => prev.filter((b) => b.id !== id));
      notifySuccess("containerEstado eliminado exitosamente");
    } catch (error) {
      notifyError("Error al eliminar containerEstado");
    }
  };

  useEffect(() => {
    fetchContainerEstados();
  }, []);

  return (
    <ContainerEstadoContext.Provider
      value={{
        containerEstados,
        loading,
        selectedcontainerEstado,
        setselectedcontainerEstado,
        fetchContainerEstados,
        createContainerEstado,
        updatecontainerEstado,
        deleteContainerEstado,
      }}
    >
      {children}
    </ContainerEstadoContext.Provider>
  );
};
