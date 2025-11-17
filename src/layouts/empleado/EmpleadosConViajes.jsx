import React, { useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ViajeEmpleadoContext } from "../../context/ViajeEmpleadoContext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

import "./ViajeEmpleado.css";

const EmpleadosConViajes = () => {
  const { id } = useParams();  
  const navigate = useNavigate();
  const { viajeEmpleados, fetchViajeEmpleados, loading } =
    useContext(ViajeEmpleadoContext);

  useEffect(() => {
    fetchViajeEmpleados();
  }, []);

  const viajesEmpleado = viajeEmpleados.filter(
    (ve) => ve.empleadoId === Number(id)
  );

  const estadoTemplate = (row) => {
    const estado = row.viajes?.viajeEstado?.nombre?.toLowerCase() || "";
    return (
      <span className={`viaje-badge ${estado.replace(" ", "-")}`}>
        {row.viajes?.viajeEstado?.nombre}
      </span>
    );
  };

  return (
    <div className="viajeempleado-page">
      <div className="viajeempleado-container">

        {/* HEADER */}
        <div className="viajeempleado-header">
          <div>
            <h1 className="viajeempleado-title">Viajes del empleado {id}</h1>
            <p className="viajeempleado-sub">Historial de viajes asignados</p>
          </div>

          <div className="viajeempleado-actions">
          <Button
            label="Volver"
            icon="pi pi-arrow-left"
            className="p-button-secondary viaje-btn volver-btn"
            onClick={() => navigate("/empleado")}
          />
            <Button
              label="Asignar viaje"
              icon="pi pi-plus"
              className="viaje-btn p-button-success"
              onClick={() => navigate(`/viajeempleado/crear/${id}`)}
            />
          </div>
        </div>

        {/* TABLA */}
        <div className="viajeempleado-table-wrapper">
          {loading ? (
            <p className="viaje-empty">Cargando...</p>
          ) : viajesEmpleado.length === 0 ? (
            <p className="viaje-empty">Este empleado no tiene viajes registrados.</p>
          ) : (
            <DataTable
              value={viajesEmpleado}
              paginator
              rows={5}
              stripedRows
              responsiveLayout="scroll"
              className="viajeempleado-table"
            >
              <Column field="id" header="ID Relación" sortable />
              <Column field="viajeId" header="Viaje ID" sortable />
              <Column header="Barco" body={(r) => r.viajes?.barcos?.nombre} sortable />
              <Column header="Origen" body={(r) => r.viajes?.puertoOrigen?.nombre} sortable />
              <Column header="Destino" body={(r) => r.viajes?.puertoDestino?.nombre} sortable />
              <Column
                header="Salida"
                body={(row) =>
                  row.viajes?.fechaSalida
                    ? new Date(row.viajes?.fechaSalida).toLocaleDateString()
                    : "—"
                }
                sortable
              />
              <Column header="Estado" body={estadoTemplate} sortable />
            </DataTable>
          )}
        </div>

      </div>
    </div>
  );
};

export default EmpleadosConViajes;
