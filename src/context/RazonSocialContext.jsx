import { createContext, useState, useEffect } from "react";
import razonSocialService from "../services/razonSocialService";
import { notifyError, notifySuccess } from "../utils/Notifier";

export const RazonSocialContext = createContext();

export const RazonSocialProvider = ({ children }) => {
  const [razonesSociales, setRazonesSociales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRazon, setSelectedRazon] = useState(null);

  const fetchRazonesSociales = async () => {
    try {
      setLoading(true);
      const { data } = await razonSocialService.getAll();
      setRazonesSociales(data.data || []);
    } catch (error) {
      notifyError("Error al cargar razones sociales");
    } finally {
      setLoading(false);
    }
  };

  const createRazonSocial = async (dataRazon) => {
    try {
      const { data } = await razonSocialService.create(dataRazon);
      setRazonesSociales((prev) => [...prev, data.data]);
      notifySuccess("Razón social creada exitosamente");
    } catch (error) {
      notifyError(error.response?.data?.message || "Error al crear razón social");
    }
  };

  const updateRazonSocial = async (id, dataRazon) => {
    try {
      const { data } = await razonSocialService.update(id, dataRazon);
      setRazonesSociales((prev) =>
        prev.map((r) => (r.id === id ? data.data : r))
      );
      notifySuccess("Razón social actualizada exitosamente");
    } catch (error) {
      notifyError(error.response?.data?.message || "Error al actualizar razón social");
    }
  };

  const deleteRazonSocial = async (id) => {
    try {
      await razonSocialService.remove(id);
      setRazonesSociales((prev) => prev.filter((r) => r.id !== id));
      notifySuccess("Razón social eliminada exitosamente");
    } catch {
      notifyError("Error al eliminar razón social");
    }
  };

  useEffect(() => {
    fetchRazonesSociales();
  }, []);

  return (
    <RazonSocialContext.Provider
      value={{
        razonesSociales,
        loading,
        selectedRazon,
        setSelectedRazon,
        fetchRazonesSociales,
        createRazonSocial,
        updateRazonSocial,
        deleteRazonSocial,
      }}
    >
      {children}
    </RazonSocialContext.Provider>
  );
};
