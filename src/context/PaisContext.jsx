import { createContext, useState, useEffect } from "react";
import paisService from "../services/paisService";
import { notifyError, notifySuccess } from "../utils/Notifier";

export const PaisContext = createContext();

export const PaisProvider = ({ children }) => {
  const [paises, setPaises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPais, setSelectedPais] = useState(null);

  const fetchPaises = async () => {
    try {
      setLoading(true);
      const { data } = await paisService.getAll();
      setPaises(data.data || []);
    } catch (error) {
      notifyError("Error al cargar los países");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createPais = async (paisData) => {
    try {
      const { data } = await paisService.create(paisData);
      setPaises((prev) => [...prev, data.data]);
      notifySuccess("País creado exitosamente");
    } catch (error) {
      notifyError(error.response?.data?.message || "Error al crear país");
    }
  };

  const updatePais = async (id, paisData) => {
    try {
      const { data } = await paisService.update(id, paisData);
      setPaises((prev) =>
        prev.map((p) => (p.id === id ? data.data : p))
      );
      notifySuccess("País actualizado exitosamente");
    } catch (error) {
      notifyError(error.response?.data?.message || "Error al actualizar país");
    }
  };

  const deletePais = async (id) => {
    try {
      await paisService.remove(id);
      setPaises((prev) => prev.filter((p) => p.id !== id));
      notifySuccess("País eliminado exitosamente");
    } catch (error) {
      notifyError("Error al eliminar país");
    }
  };

  useEffect(() => {
    fetchPaises();
  }, []);

  return (
    <PaisContext.Provider
      value={{
        paises,
        loading,
        selectedPais,
        setSelectedPais,
        fetchPaises,
        createPais,
        updatePais,
        deletePais,
      }}
    >
      {children}
    </PaisContext.Provider>
  );
};
