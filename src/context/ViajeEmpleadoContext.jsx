import { createContext, useState, useEffect } from "react";
import viajeEmpleadoService from "../services/viajeEmpleadoService";
import { notifyError, notifySuccess } from "../utils/Notifier";

export const ViajeEmpleadoContext = createContext();

export const ViajeEmpleadoProvider = ({ children }) => {
  const [viajeEmpleados, setViajeEmpleados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedViajeEmpleado, setSelectedViajeEmpleado] = useState(null);

  //obtener todos
  const fetchViajeEmpleados = async () => {
    try {
      setLoading(true);
      const { data } = await viajeEmpleadoService.getAll();
      setViajeEmpleados(data.data || []);
    } catch (error) {
      notifyError("Error al cargar viaje_empleado");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  //crear
  const createViajeEmpleado = async (viajeEmpleadoData) => {
    try {
      const { data } = await viajeEmpleadoService.create(viajeEmpleadoData);
      setViajeEmpleados((prev) => [...prev, data.data]);
      notifySuccess("Relación viaje-empleado creada exitosamente");
    } catch (error) {
      notifyError(
        error.response?.data?.message ||
          "Error al crear relación viaje-empleado"
      );
    }
  };

  //editar
  const updateViajeEmpleado = async (id, viajeEmpleadoData) => {
    try {
      const { data } = await viajeEmpleadoService.update(id, viajeEmpleadoData);
      setViajeEmpleados((prev) =>
        prev.map((ve) => (ve.id === id ? data.data : ve))
      );
      notifySuccess("Relación viaje-empleado actualizada");
    } catch (error) {
      notifyError(
        error.response?.data?.message ||
          "Error al actualizar relación viaje-empleado"
      );
    }
  };

  //eliminar
  const deleteViajeEmpleado = async (id) => {
    try {
      await viajeEmpleadoService.remove(id);
      setViajeEmpleados((prev) => prev.filter((ve) => ve.id !== id));
      notifySuccess("Relación viaje-empleado eliminada");
    } catch (error) {
      notifyError("Error al eliminar relación viaje-empleado");
    }
  };

  // Obtener viajes de un empleado 
  const fetchViajesByEmpleado = async (empleadoId) => {
    try {
      setLoading(true);
      const { data } = await viajeEmpleadoService.getByEmpleado(empleadoId);
      setViajeEmpleados(data.data || []);
    } catch (error) {
      notifyError("Error al cargar viajes del empleado");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  }, []);

  return (
    <ViajeEmpleadoContext.Provider
      value={{
        viajeEmpleados,
        loading,
        selectedViajeEmpleado,
        setSelectedViajeEmpleado,
        fetchViajeEmpleados,
        createViajeEmpleado,
        updateViajeEmpleado,
        deleteViajeEmpleado,
        fetchViajesByEmpleado
      }}
    >
      {children}
    </ViajeEmpleadoContext.Provider>
  );
};
