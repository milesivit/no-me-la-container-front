import { createContext, useState, useEffect } from "react";
import viajeContainerService from "../services/viajeContainerService";
import { notifyError, notifySuccess } from "../utils/Notifier";

export const ViajeContainerContext = createContext();

export const ViajeContainerProvider = ({ children }) => {
  const [viajeContainers, setViajeContainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedViajeContainer, setSelectedViajeContainer] = useState(null);

  // Obtener todos
  const fetchViajeContainers = async () => {
    try {
      setLoading(true);
      const { data } = await viajeContainerService.getAll();
      setViajeContainers(data.data || []);
    } catch (error) {
      notifyError("Error al cargar viaje_container");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Crear
  const createViajeContainer = async (viajeContainerData) => {
    try {
      const { data } = await viajeContainerService.create(viajeContainerData);
      setViajeContainers((prev) => [...prev, data.data]);
      notifySuccess("Viaje-Container creado exitosamente");
    } catch (error) {
      notifyError(
        error.response?.data?.message ||
          "Error al crear viaje-container"
      );
    }
  };

  // Editar
  const updateViajeContainer = async (id, viajeContainerData) => {
    try {
      const { data } = await viajeContainerService.update(
        id,
        viajeContainerData
      );
      setViajeContainers((prev) =>
        prev.map((vc) => (vc.id === id ? data.data : vc))
      );
      notifySuccess("Viaje-Container actualizado");
    } catch (error) {
      notifyError(
        error.response?.data?.message ||
          "Error al actualizar viaje-container"
      );
    }
  };

  // Eliminar
  const deleteViajeContainer = async (id) => {
    try {
      await viajeContainerService.remove(id);
      setViajeContainers((prev) => prev.filter((vc) => vc.id !== id));
      notifySuccess("Viaje-Container eliminado");
    } catch (error) {
      notifyError("Error al eliminar viaje-container");
    }
  };

  useEffect(() => {
    fetchViajeContainers();
  }, []);

  return (
    <ViajeContainerContext.Provider
      value={{
        viajeContainers,
        loading,
        selectedViajeContainer,
        setSelectedViajeContainer,
        fetchViajeContainers,
        createViajeContainer,
        updateViajeContainer,
        deleteViajeContainer,
      }}
    >
      {children}
    </ViajeContainerContext.Provider>
  );
};
