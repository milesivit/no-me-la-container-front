import { createContext, useState, useEffect } from "react";
import impuestoService from "../services/impuestoService";
import { notifyError, notifySuccess } from "../utils/Notifier";

export const ImpuestoContext = createContext();

export const ImpuestoProvider = ({ children }) => {
  const [impuestos, setImpuestos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImpuesto, setSelectedImpuesto] = useState(null);

  // Obtener todos los impuestos
  const fetchImpuestos = async () => {
    try {
      setLoading(true);
      const { data } = await impuestoService.getAll();
      setImpuestos(data.data || []);
    } catch (error) {
      notifyError("Error al cargar los impuestos");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Crear impuesto
  const createImpuesto = async (impuestoData) => {
    try {
      const { data } = await impuestoService.create(impuestoData);
      setImpuestos((prev) => [...prev, data.data]);
      notifySuccess("Impuesto creado exitosamente");
    } catch (error) {
      notifyError(
        error.response?.data?.message || "Error al crear impuesto"
      );
    }
  };

  // Editar impuesto
  const updateImpuesto = async (id, impuestoData) => {
    try {
      const { data } = await impuestoService.update(id, impuestoData);
      setImpuestos((prev) =>
        prev.map((i) => (i.id === id ? data.data : i))
      );
      notifySuccess("Impuesto actualizado exitosamente");
    } catch (error) {
      notifyError(
        error.response?.data?.message || "Error al actualizar impuesto"
      );
    }
  };

  // Eliminar impuesto
  const deleteImpuesto = async (id) => {
    try {
      await impuestoService.remove(id);
      setImpuestos((prev) => prev.filter((i) => i.id !== id));
      notifySuccess("Impuesto eliminado exitosamente");
    } catch (error) {
      notifyError("Error al eliminar impuesto");
    }
  };

  useEffect(() => {
    fetchImpuestos();
  }, []);

  return (
    <ImpuestoContext.Provider
      value={{
        impuestos,
        loading,
        selectedImpuesto,
        setSelectedImpuesto,
        fetchImpuestos,
        createImpuesto,
        updateImpuesto,
        deleteImpuesto,
      }}
    >
      {children}
    </ImpuestoContext.Provider>
  );
};
