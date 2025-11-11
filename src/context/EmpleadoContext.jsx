import { createContext, useState, useEffect } from "react";
import empleadoService from "../services/empleadoService";

export const EmpleadoContext = createContext();

export const EmpleadoProvider = ({ children }) => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEmpleados = async () => {
    setLoading(true);
    try {
      const { data } = await empleadoService.getAll();
      setEmpleados(data);
    } catch (error) {
      console.error("Error al obtener empleados:", error);
    } finally {
      setLoading(false);
    }
  };

  const createEmpleado = async (nuevoEmpleado) => {
    try {
      const { data } = await empleadoService.create(nuevoEmpleado);
      setEmpleados((prev) => [...prev, data]);
      return data;
    } catch (error) {
      console.error("Error al crear empleado:", error);
      throw error;
    }
  };

  const deleteEmpleado = async (id) => {
    try {
      await empleadoService.delete(id);
      setEmpleados((prev) => prev.filter((e) => e.id !== id));
    } catch (error) {
      console.error("Error al eliminar empleado:", error);
    }
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  return (
    <EmpleadoContext.Provider value={{ empleados, loading, fetchEmpleados, createEmpleado, deleteEmpleado }}>
      {children}
    </EmpleadoContext.Provider>
  );
};
