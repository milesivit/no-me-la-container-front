import { createContext, useState, useEffect } from "react";
import remitoService from "../services/remitoService";
import { notifyError, notifySuccess } from "../utils/Notifier";

export const RemitoContext = createContext();

export const RemitoProvider = ({ children }) => {
  const [remitos, setRemitos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRemito, setSelectedRemito] = useState(null);

  // Obtener todos los remitos
  const fetchRemitos = async () => {
    try {
      setLoading(true);
      const { data } = await remitoService.getAll();
      setRemitos(data.data || []);
    } catch (error) {
      notifyError("Error al cargar los remitos");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Crear remito
  const createRemito = async (remitoData) => {
    try {
      const { data } = await remitoService.create(remitoData);
      setRemitos((prev) => [...prev, data.data]);
      notifySuccess("Remito creado exitosamente");
    } catch (error) {
      notifyError(
        error.response?.data?.message || "Error al crear el remito"
      );
    }
  };

  // Editar remito
  const updateRemito = async (id, remitoData) => {
    try {
      const { data } = await remitoService.update(id, remitoData);
      setRemitos((prev) =>
        prev.map((r) => (r.id === id ? data.data : r))
      );
      notifySuccess("Remito actualizado exitosamente");
    } catch (error) {
      notifyError(
        error.response?.data?.message || "Error al actualizar el remito"
      );
    }
  };

  // Eliminar remito
  const deleteRemito = async (id) => {
    try {
      await remitoService.remove(id);
      setRemitos((prev) => prev.filter((r) => r.id !== id));
      notifySuccess("Remito eliminado exitosamente");
    } catch (error) {
      notifyError("Error al eliminar el remito");
    }
  };

  useEffect(() => {
    fetchRemitos();
  }, []);

  return (
    <RemitoContext.Provider
      value={{
        remitos,
        loading,
        selectedRemito,
        setSelectedRemito,
        fetchRemitos,
        createRemito,
        updateRemito,
        deleteRemito,
      }}
    >
      {children}
    </RemitoContext.Provider>
  );
};
