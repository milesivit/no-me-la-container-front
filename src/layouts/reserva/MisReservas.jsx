import React, { useContext, useEffect, useRef } from "react";
import { ReservaContext } from "../../context/ReservaContext";
import { AuthContext } from "../../context/AuthContext";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { useNavigate } from "react-router-dom";
import exportFacturaToPDF from "../../utils/ExportFacturaToPdf";
import "./MisReservas.css";

const MisReservas = () => {
  const { reservas, fetchReservasCliente, loading } = useContext(ReservaContext);
  const { user } = useContext(AuthContext);
  const toast = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.clienteId) fetchReservasCliente(user.clienteId);
  }, [user]);

  // 👉 USEEFFECT PARA VER LA RESERVA COMPLETA
  useEffect(() => {
    if (reservas.length > 0) {
      console.log(
        "%c🔍 RESERVA COMPLETA:",
        "color: #009fd4; font-weight: bold;"
      );
      console.log(JSON.stringify(reservas[0], null, 2));
    }
  }, [reservas]);

  return (
    <div className="misreservas-page">
      <div className="misreservas-container">
        <Toast ref={toast} />
        <Tooltip placeholder="Descargar Remito" target=".remito-btn" />
        <Tooltip placeholder="Descargar Factura" target=".factura-btn" />

        <h1 className="misreservas-title">Mis Reservas</h1>

        {loading ? (
          <p>Cargando reservas...</p>
        ) : reservas.length === 0 ? (
          <p>No tienes reservas realizadas.</p>
        ) : (
          <div className="misreservas-card-container">
            {reservas.map((r) => {
              const viaje = r?.viajesContainer?.viajes;
              const container = r?.viajesContainer?.containers;

              const fechaEntrega = viaje?.promesaDeEntrega
                ? new Date(viaje.promesaDeEntrega).toLocaleDateString()
                : "—";

              return (
                <div key={r.id} className="reserva-card">
                  
                  <div className="reserva-card-header">
                    <i className="pi pi-calendar"></i>
                    <span>{r.fechaReserva?.slice(0, 10)}</span>
                    <div className="reserva-id-badge">#{r.id}</div>
                  </div>

                  <div className="reserva-info">
                    <p><b>Container:</b> {container?.codigo}</p>
                    <p><b>Barco:</b> {viaje?.barcos?.nombre}</p>

                    <div className="reserva-ruta">
                      <i className="pi pi-map-marker" />
                      <span>{viaje?.puertoOrigen?.nombre}</span>
                      <i className="pi pi-arrow-right arrow" />
                      <i className="pi pi-map-marker" />
                      <span>{viaje?.puertoDestino?.nombre}</span>
                    </div>

                    <p><b>Entrega estimada:</b> {fechaEntrega}</p>
                  </div>

                  <div className="reserva-export-buttons">
                    <button 
                      className="export-btn remito-btn"
                      data-pr-tooltip="Descargar Remito"
                      data-pr-position="top"
                    >
                      <i className="pi pi-file" />
                    </button>

                    <button 
                      className="export-btn factura-btn"
                      data-pr-tooltip="Descargar Factura"
                      data-pr-position="top"
                      onClick={() => exportFacturaToPDF(r)}
                    >
                      <i className="pi pi-file-pdf" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MisReservas;
