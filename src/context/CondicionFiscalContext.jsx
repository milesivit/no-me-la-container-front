import { createContext, useState, useEffect } from "react";
import condicionFiscalService from "../services/condicionFiscalService";
import { notifyError, notifySuccess } from "../utils/Notifier";

export const CondicionFiscalContext = createContext();

export const CondicionFiscalProvider = ({ children }) => {
  const [condicionesFiscales, setCondicionesFiscales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCondicion, setSelectedCondicion] = useState(null);

  const fetchCondicionesFiscales = async () => {
    try {
      setLoading(true);
      const { data } = await condicionFiscalService.getAll();
      setCondicionesFiscales(data.data || []);
    } catch (error) {
      notifyError("Error al cargar condiciones fiscales");
    } finally {
      setLoading(false);
    }
  };

  const createCondicionFiscal = async (dataCond) => {
    try {
      const { data } = await condicionFiscalService.create(dataCond);
      setCondicionesFiscales((prev) => [...prev, data.data]);
      notifySuccess("Condición fiscal creada exitosamente");
    } catch (error) {
      notifyError(error.response?.data?.message || "Error al crear condición fiscal");
    }
  };

  const updateCondicionFiscal = async (id, dataCond) => {
    try {
      const { data } = await condicionFiscalService.update(id, dataCond);
      setCondicionesFiscales((prev) =>
        prev.map((c) => (c.id === id ? data.data : c))
      );
      notifySuccess("Condición fiscal actualizada exitosamente");
    } catch (error) {
      notifyError(error.response?.data?.message || "Error al actualizar condición fiscal");
    }
  };

  const deleteCondicionFiscal = async (id) => {
    try {
      await condicionFiscalService.remove(id);
      setCondicionesFiscales((prev) => prev.filter((c) => c.id !== id));
      notifySuccess("Condición fiscal eliminada exitosamente");
    } catch {
      notifyError("Error al eliminar condición fiscal");
    }
  };

  useEffect(() => {
    fetchCondicionesFiscales();
  }, []);

  return (
    <CondicionFiscalContext.Provider
      value={{
        condicionesFiscales,
        loading,
        selectedCondicion,
        setSelectedCondicion,
        fetchCondicionesFiscales,
        createCondicionFiscal,
        updateCondicionFiscal,
        deleteCondicionFiscal,
      }}
    >
      {children}
    </CondicionFiscalContext.Provider>
  );
};
