import React, { useContext, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { EmpleadoContext } from "../../context/EmpleadoContext";
import "./Empleado.css";
import { useNavigate } from "react-router-dom";

const EmpleadoTablaForm = () => {
  const { empleados, loading, fetchEmpleados } = useContext(EmpleadoContext);
  const navigate = useNavigate();
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const headerTemplate = (
    <div className="empleado-header">
      <h1 className="empleado-title">Lista de Empleados</h1>

      <div className="empleado-header-actions">
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
  console.log(empleados)

  return (
      <div className="empleado-page">
      <div className="empleado-page-container">
        <Toast ref={toast} />

        {loading ? (
          <p>Cargando empleados...</p>
        ) : empleados.length === 0 ? (
          <p>No hay empleados registrados.</p>
        ) : (
          <div className="empleado-table-wrapper">
            <DataTable
              ref={dt}
              value={empleados?.data ?? []}
              paginator
              rows={5}
              rowsPerPageOptions={[5, 10, 25, 50]}
              stripedRows
              responsiveLayout="scroll"
              emptyMessage="No hay empleados para mostrar."
              className="empleado-table"
              header={headerTemplate}
            >
              <Column field="id" header="ID" sortable />
              <Column field="numeroLegajo" header="Legajo" sortable />
              <Column field="cuil" header="CUIL" sortable />
              <Column field="dni" header="DNI" sortable />

              {/* Datos de relaciones */}
              <Column 
                header="Usuario" 
                body={(row) => row.usuario?.correo || "—"} 
                sortable 
                />
              <Column
                header="Cargo"
                body={(row) => row.cargo?.nombre || "—"}
                sortable
              />
              <Column
                header="Sexo"
                body={(row) =>  row.sexo?.nombre || "—"}
                sortable
              />
              <Column
                header="País"
                body={(row) => row.pais?.nombre || "—"}
                sortable
              />
              <Column
                header="Acciones"
                body={(row) => (
                  <Button
                    icon="pi pi-ship"
                    label="Ver viajes"
                    className="p-button-rounded p-button-info"
                    onClick={() => {
                      navigate(`/empleado/viajes/${row.id}`);
                    }}
                  />
                )}
              />

            </DataTable>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmpleadoTablaForm;
