import { createContext, useState, useEffect } from "react";
import sexoService from "../services/sexoService";
import { notifyError, notifySuccess } from "../utils/Notifier";

export const SexoContext = createContext();

export const SexoProvider = ({ children }) => {
  const [sexos, setSexos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSexo, setSelectedSexo] = useState(null);

  const fetchSexos = async () => {
    try {
      setLoading(true);
      const { data } = await sexoService.getAll();
      setSexos(data.data || []);
    } catch (error) {
      notifyError("Error al cargar los sexos");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createSexo = async (sexoData) => {
    try {
      const { data } = await sexoService.create(sexoData);
      setSexos((prev) => [...prev, data.data]);
      notifySuccess("Sexo creado exitosamente");
    } catch (error) {
      notifyError(error.response?.data?.message || "Error al crear sexo");
    }
  };

  const updateSexo = async (id, sexoData) => {
    try {
      const { data } = await sexoService.update(id, sexoData);
      setSexos((prev) =>
        prev.map((s) => (s.id === id ? data.data : s))
      );
      notifySuccess("Sexo actualizado exitosamente");
    } catch (error) {
      notifyError(error.response?.data?.message || "Error al actualizar sexo");
    }
  };

  const deleteSexo = async (id) => {
    try {
      await sexoService.remove(id);
      setSexos((prev) => prev.filter((s) => s.id !== id));
      notifySuccess("Sexo eliminado exitosamente");
    } catch (error) {
      notifyError("Error al eliminar sexo");
    }
  };

  useEffect(() => {
    fetchSexos();
  }, []);

  return (
    <SexoContext.Provider
      value={{
        sexos,
        loading,
        selectedSexo,
        setSelectedSexo,
        fetchSexos,
        createSexo,
        updateSexo,
        deleteSexo,
      }}
    >
      {children}
    </SexoContext.Provider>
  );
};
