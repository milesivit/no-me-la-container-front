import React, { useContext, useEffect, useRef } from "react";
import { ReservaContext } from "../../context/ReservaContext";
import { AuthContext } from "../../context/AuthContext";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import "./MisReservas.css";

const MisReservas = () => {
  const { reservas, fetchReservasCliente, loading } = useContext(ReservaContext);
  const { user } = useContext(AuthContext);
  const toast = useRef(null);
  const dt = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.clienteId) fetchReservasCliente(user.clienteId);
  }, [user]);

  const headerTemplate = (
    <div className="reserva-header">
      <h1 className="reserva-title">Mis Reservas</h1>

      <Button
        type="button"
        icon="pi pi-file"
        rounded
        tooltip="Exportar"
        tooltipOptions={{ position: "top" }}
        onClick={() => dt.current.exportCSV()}
      />
    </div>
  );

  const pagarButtonTemplate = (rowData) => (
    <Button
      label="Pagar"
      icon="pi pi-credit-card"
      className="p-button-success p-button-sm"
      onClick={() => navigate(`/pagos/crear/${rowData.id}`)}
    />
  );

  return (
    <div className="reserva-page">
      <div className="reserva-page-container">
        <Toast ref={toast} />

        {loading ? (
          <p>Cargando reservas...</p>
        ) : reservas.length === 0 ? (
          <p>No tienes reservas realizadas.</p>
        ) : (
          <div className="reserva-table-wrapper">
            <DataTable
              ref={dt}
              value={reservas}
              paginator
              rows={5}
              rowsPerPageOptions={[5, 10, 25]}
              stripedRows
              responsiveLayout="scroll"
              header={headerTemplate}
              className="reserva-table"
            >
              <Column field="fechaReserva" header="Fecha" body={(row) => row.fechaReserva?.slice(0,10)} />
              <Column
                header="Container"
                body={(row) => row.viajesContainer?.containers?.codigo}
              />

              <Column
                header="Puerto Origen"
                body={(row) => row.viajesContainer?.viajes?.puertoOrigen?.nombre}
              />

              <Column
                header="Puerto Destino"
                body={(row) => row.viajesContainer?.viajes?.puertoDestino?.nombre}
              />

              <Column
                header="Barco"
                body={(row) => row.viajesContainer?.viajes?.barcos?.nombre}
              />

              <Column
                header="Promesa de entrega"
                body={(row) =>
                  row.viajesContainer?.viajes?.promesaDeEntrega
                    ? new Date(row.viajesContainer.viajes.promesaDeEntrega).toLocaleDateString()
                    : "—"
                }
              />

            </DataTable>
          </div>
        )}
      </div>
    </div>
  );
};

export default MisReservas;
