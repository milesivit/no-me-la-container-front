import React, { useContext, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { useParams } from "react-router-dom";

import { ViajeEmpleadoContext } from "../../context/ViajeEmpleadoContext";
import "./EmpleadoViajesModerador.css";
import "primeicons/primeicons.css";

const EmpleadoViajesModerador = () => {
  const { viajeEmpleados, fetchViajesByEmpleado, loading } =
    useContext(ViajeEmpleadoContext);

  const { id: empleadoId } = useParams();

  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    fetchViajesByEmpleado(empleadoId);
  }, [empleadoId]);

  const headerTemplate = (
    <div className="barco-header">
      <h1 className="barco-title">Tus Viajes Asignados</h1>

      <div className="barco-header-actions">
        <Button
          type="button"
          icon="pi pi-file"
          rounded
          tooltip="Exportar"
          tooltipOptions={{ position: "top" }}
          onClick={() => dt.current.exportCSV()}
        />
      </div>
    </div>
  );

  return (
    <div className="barco-page">
      <div className="barco-page-container">
        <Toast ref={toast} />

        {loading ? (
          <p>Cargando...</p>
        ) : viajeEmpleados.length === 0 ? (
          <p>No hay viajes asignados a este empleado.</p>
        ) : (
          <div className="barco-table-wrapper">
          <DataTable
            ref={dt}
            value={viajeEmpleados}
            paginator
            rows={5}
            rowsPerPageOptions={[5, 10, 25, 50]}
            stripedRows
            scrollable
            scrollHeight="500px"
            responsiveLayout="scroll"
            emptyMessage="Sin registros."
            className="barco-table"
            header={headerTemplate}
          >
            <Column field="viajeId" header="ID Viaje" sortable />

            <Column
              header="Fecha salida"
              body={(row) =>
                row.viajes?.fechaSalida
                  ? new Date(row.viajes.fechaSalida).toLocaleDateString()
                  : ""
              }
            />

            <Column
              header="Promesa entrega"
              body={(row) =>
                row.viajes?.promesaDeEntrega
                  ? new Date(row.viajes.promesaDeEntrega).toLocaleDateString()
                  : ""
              }
            />

            <Column
              header="Origen"
              body={(row) => row.viajes?.puertoOrigen?.nombre}
            />

            <Column
              header="Destino"
              body={(row) => row.viajes?.puertoDestino?.nombre}
            />

            <Column
              header="Barco"
              body={(row) => row.viajes?.barcos?.nombre}
            />

            <Column
              header="Estado"
              body={(row) => row.viajes?.viajeEstado?.nombre}
            />
          </DataTable>


          </div>
        )}
      </div>
    </div>
  );
};

export default EmpleadoViajesModerador;
