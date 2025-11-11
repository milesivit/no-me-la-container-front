import { createContext, useState, useEffect } from "react";
import cargoService from "../services/cargoService";
import { notifyError, notifySuccess } from "../utils/Notifier";

export const CargoContext = createContext();

export const CargoProvider = ({ children }) => {
  const [cargos, setCargos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCargo, setSelectedCargo] = useState(null);

  const fetchCargos = async () => {
    try {
      setLoading(true);
      const { data } = await cargoService.getAll();
      setCargos(data.data || []);
    } catch (error) {
      notifyError("Error al cargar los cargos");
    } finally {
      setLoading(false);
    }
  };

  const createCargo = async (cargoData) => {
    try {
      const { data } = await cargoService.create(cargoData);
      setCargos((prev) => [...prev, data.data]);
      notifySuccess("Cargo creado exitosamente");
    } catch (error) {
      notifyError(error.response?.data?.message || "Error al crear cargo");
    }
  };

  const updateCargo = async (id, cargoData) => {
    try {
      const { data } = await cargoService.update(id, cargoData);
      setCargos((prev) =>
        prev.map((c) => (c.id === id ? data.data : c))
      );
      notifySuccess("Cargo actualizado exitosamente");
    } catch (error) {
      notifyError(error.response?.data?.message || "Error al actualizar cargo");
    }
  };

  const deleteCargo = async (id) => {
    try {
      await cargoService.remove(id);
      setCargos((prev) => prev.filter((c) => c.id !== id));
      notifySuccess("Cargo eliminado exitosamente");
    } catch {
      notifyError("Error al eliminar cargo");
    }
  };

  useEffect(() => {
    fetchCargos();
  }, []);

  return (
    <CargoContext.Provider
      value={{
        cargos,
        loading,
        selectedCargo,
        setSelectedCargo,
        fetchCargos,
        createCargo,
        updateCargo,
        deleteCargo,
      }}
    >
      {children}
    </CargoContext.Provider>
  );
};
