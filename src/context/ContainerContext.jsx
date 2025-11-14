import { createContext, useState, useEffect } from "react";
import containerService from "../services/containerService";
import { notifyError, notifySuccess } from "../utils/Notifier";

export const ContainerContext = createContext();

export const ContainerProvider = ({ children }) => {
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedContainer, setSelectedContainer] = useState(null);

  // Obtener todos
  const fetchContainers = async () => {
    try {
      setLoading(true);
      const { data } = await containerService.getAll();
      setContainers(data.data || []);
    } catch (error) {
      notifyError("Error al cargar los containers");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Crear
  const createContainer = async (containerData) => {
    try {
      const { data } = await containerService.create(containerData);
      setContainers((prev) => [...prev, data.data]);
      notifySuccess("Container creado exitosamente");
    } catch (error) {
      notifyError(
        error.response?.data?.message ||
        "Error al crear container"
      );
    }
  };

  // Editar
  const updateContainer = async (id, containerData) => {
    try {
      const { data } = await containerService.update(id, containerData);
      setContainers((prev) =>
        prev.map((c) => (c.id === id ? data.data : c))
      );
      notifySuccess("Container actualizado exitosamente");
    } catch (error) {
      notifyError(
        error.response?.data?.message ||
        "Error al actualizar container"
      );
    }
  };

  // Eliminar
  const deleteContainer = async (id) => {
    try {
      await containerService.remove(id);
      setContainers((prev) => prev.filter((c) => c.id !== id));
      notifySuccess("Container eliminado exitosamente");
    } catch (error) {
      notifyError("Error al eliminar container");
    }
  };

  useEffect(() => {
    fetchContainers();
  }, []);

  return (
    <ContainerContext.Provider
      value={{
        containers,
        loading,
        selectedContainer,
        setSelectedContainer,
        fetchContainers,
        createContainer,
        updateContainer,
        deleteContainer,
      }}
    >
      {children}
    </ContainerContext.Provider>
  );
};
