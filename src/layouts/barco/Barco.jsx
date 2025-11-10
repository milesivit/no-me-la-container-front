import React, { useContext, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import { Toast } from "primereact/toast";
import { BarcoContext } from "../../context/BarcoContext";

const BarcoForm = () => {
  const { barcos, fetchBarcos, deleteBarco, loading } = useContext(BarcoContext);
  const toast = useRef(null);

  useEffect(() => {
    fetchBarcos();
  }, []);

  const handleDelete = async (id) => {
    await deleteBarco(id);
    toast.current.show({
      severity: "success",
      summary: "Eliminado",
      detail: "Barco eliminado con éxito",
      life: 3000,
    });
  };

  return (
    <div>
      <Navbar />
      <Toast ref={toast} />
        <h1 style={{ marginBottom: "2rem" }}>Lista de Barcos</h1>

        {loading ? (
          <p>Cargando barcos...</p>
        ) : barcos.length === 0 ? (
          <p>No hay barcos registrados.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
              width: "100%",
              maxWidth: "1200px",
            }}
          >
            {barcos.map((barco) => (
              <div
                key={barco.id}
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  padding: "1.5rem",
                  borderRadius: "1rem",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <h3 style={{ color: "#00bcd4" }}>{barco.nombre}</h3>
                  <p><strong>Matrícula:</strong> {barco.nroMatricula}</p>
                  <p><strong>Registro:</strong> {barco.nroRegistro}</p>
                  <p><strong>Modelo:</strong> {barco.modelo || "—"}</p>
                  <p><strong>Constructora:</strong> {barco.constructura || "—"}</p>
                  <p><strong>Capacidad Máx.:</strong> {barco.capacidadMaxContainer} containers</p>
                </div>

                <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => handleDelete(barco.id)}
                    style={{
                      backgroundColor: "#e53935",
                      border: "none",
                      color: "white",
                      padding: "0.5rem 1rem",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Eliminar
                  </button>
                  <button
                    style={{
                      backgroundColor: "#00bcd4",
                      border: "none",
                      color: "white",
                      padding: "0.5rem 1rem",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
  );
};

export default BarcoForm;
