import React, { useContext, useEffect } from "react";
import { ReservaContext } from "../../context/ReservaContext";
import { AuthContext } from "../../context/AuthContext";

import "./MisReservas.css";

const ReservasAdmin = () => {
  const { reservas, fetchReservas, loading } = useContext(ReservaContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user?.rol === "admin") {
      fetchReservas();
    }
  }, [user]);

  return (
    <div className="misreservas-page">
      <div className="misreservas-container">
        <h1 className="misreservas-title">Reservas de clientes</h1>

        {loading ? (
          <p>Cargando todas las reservas...</p>
        ) : reservas.length === 0 ? (
          <p>No hay reservas registradas.</p>
        ) : (
          <div className="misreservas-card-container">
            {reservas.map((r) => (
              <div key={r.id} className="reserva-card">

                {/* HEADER */}
                <div className="reserva-card-header">
                  <i className="pi pi-box"></i>
                  <span>Reserva</span>
                  <span className="reserva-id-badge">#{r.id}</span>
                </div>

                {/* INFO GENERAL */}
                <div className="reserva-info">
                  <p><b>Cliente:</b> {r.clientes?.nombre}</p>
                  <p><b>Fecha:</b> {r.fechaReserva?.slice(0, 10)}</p>
                  <p><b>Container:</b> {r.viajesContainer?.containers?.codigo}</p>
                </div>

                {/* RUTA */}
                <div className="reserva-ruta">
                  <i className="pi pi-map-marker"></i>
                  <span>{r.viajesContainer?.viajes?.puertoOrigen?.nombre}</span>

                  <span className="arrow">→</span>

                  <i className="pi pi-map-marker"></i>
                  <span>{r.viajesContainer?.viajes?.puertoDestino?.nombre}</span>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservasAdmin;
