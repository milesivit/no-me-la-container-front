import { createContext, useState, useEffect } from "react";
import cargaContainerService from "../services/cargaContainerService";
import { notifyError, notifySuccess } from "../utils/Notifier";

export const CargaContainerContext = createContext();

export const CargaContainerProvider = ({ children }) => {
  const [cargasContainer, setCargasContainer] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCargaContainer, setSelectedCargaContainer] = useState(null);

  // Obtener todos
  const fetchCargasContainer = async () => {
    try {
      setLoading(true);
      const { data } = await cargaContainerService.getAll();
      setCargasContainer(data.data || []);
    } catch (error) {
      notifyError("Error al cargar carga_container");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Crear
  const createCargaContainer = async (cargaContainerData) => {
    try {
      const { data } = await cargaContainerService.create(
        cargaContainerData
      );
      setCargasContainer((prev) => [...prev, data.data]);
      notifySuccess("Carga-Container creada exitosamente");
    } catch (error) {
      notifyError(
        error.response?.data?.message ||
          "Error al crear carga-container"
      );
    }
  };

  // Editar
  const updateCargaContainer = async (id, cargaContainerData) => {
    try {
      const { data } = await cargaContainerService.update(
        id,
        cargaContainerData
      );
      setCargasContainer((prev) =>
        prev.map((cc) => (cc.id === id ? data.data : cc))
      );
      notifySuccess("Carga-Container actualizada correctamente");
    } catch (error) {
      notifyError(
        error.response?.data?.message ||
          "Error al actualizar carga-container"
      );
    }
  };

  // Eliminar
  const deleteCargaContainer = async (id) => {
    try {
      await cargaContainerService.remove(id);
      setCargasContainer((prev) => prev.filter((cc) => cc.id !== id));
      notifySuccess("Carga-Container eliminada exitosamente");
    } catch (error) {
      notifyError("Error al eliminar carga-container");
    }
  };

  useEffect(() => {
    fetchCargasContainer();
  }, []);

  return (
    <CargaContainerContext.Provider
      value={{
        cargasContainer,
        loading,
        selectedCargaContainer,
        setSelectedCargaContainer,
        fetchCargasContainer,
        createCargaContainer,
        updateCargaContainer,
        deleteCargaContainer,
      }}
    >
      {children}
    </CargaContainerContext.Provider>
  );
};
