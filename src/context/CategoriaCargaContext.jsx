// src/context/categoriaCargaContext.jsx
import { createContext, useState, useEffect } from "react";
import categoriaCargaService from "../services/categoriaCargaService";
import { notifyError, notifySuccess } from "../utils/Notifier";

export const categoriaCargaContext = createContext();

export const categoriaCargaProvider = ({ children }) => {
  const [categoriacargas, setcategoriacargas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedcategoriacarga, setselectedcategoriacarga] = useState(null);

  //obtener todos los categoriacargas
  const fetchCategoriaCargas = async () => {
    try {
      setLoading(true);
      const { data } = await categoriaCargaService.getAll();
      setcategoriacargas(data.data || []);
    } catch (error) {
      notifyError("Error al cargar los categoriacargas");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  //crear categoriacarga
  const createCategoriaCarga = async (categoriacargaData) => {
    try {
      const { data } = await categoriaCargaService.create(categoriacargaData);
      setcategoriacargas((prev) => [...prev, data.data]);
      notifySuccess("categoriacarga creado exitosamente");
    } catch (error) {
      notifyError(error.response?.data?.message || "Error al crear categoriacarga");
    }
  };

  // Editar categoriacarga
  const updateCategoriaCarga = async (id, categoriacargaData) => {
    try {
      const { data } = await categoriaCargaService.update(id, categoriacargaData);
      setcategoriacargas((prev) =>
        prev.map((b) => (b.id === id ? data.data : b))
      );
      notifySuccess("categoriacarga actualizado exitosamente");
    } catch (error) {
      notifyError(error.response?.data?.message || "Error al actualizar categoriacarga");
    }
  };

  // Eliminar categoriacarga
  const deleteCategoriaCarga = async (id) => {
    try {
      await categoriaCargaService.remove(id);
      setcategoriacargas((prev) => prev.filter((b) => b.id !== id));
      notifySuccess("categoriacarga eliminado exitosamente");
    } catch (error) {
      notifyError("Error al eliminar categoriacarga");
    }
  };

  useEffect(() => {
    fetchCategoriaCargas();
  }, []);

  return (
    <categoriaCargaContext.Provider
      value={{
        categoriacargas,
        loading,
        selectedcategoriacarga,
        setselectedcategoriacarga,
        fetchCategoriaCargas,
        createCategoriaCarga,
        updateCategoriaCarga,
        deleteCategoriaCarga,
      }}
    >
      {children}
    </categoriaCargaContext.Provider>
  );
};
