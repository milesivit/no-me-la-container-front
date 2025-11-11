import { createContext, useState, useEffect } from "react";
import clienteService from "../services/clienteService";

export const ClienteContext = createContext();

export const ClienteProvider = ({ children }) => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const { data } = await clienteService.getAll();
      setClientes(data);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  const createCliente = async (nuevoCliente) => {
    try {
      const { data } = await clienteService.create(nuevoCliente);
      setClientes((prev) => [...prev, data]);
      return data;
    } catch (error) {
      console.error("Error al crear cliente:", error);
      throw error;
    }
  };

  const deleteCliente = async (id) => {
    try {
      await clienteService.delete(id);
      setClientes((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  return (
    <ClienteContext.Provider value={{ clientes, loading, fetchClientes, createCliente, deleteCliente }}>
      {children}
    </ClienteContext.Provider>
  );
};
