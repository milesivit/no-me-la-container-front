import React, { useContext, useEffect, useRef, useState } from "react";
import { ReservaContext } from "../../context/ReservaContext";
import { AuthContext } from "../../context/AuthContext";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import exportFacturaToPDF from "../../utils/ExportFacturaToPdf";
import WeatherModal from "../../components/WeatherModal";
import { getWeatherByCoords } from "../../services/weatherService";

import "./MisReservas.css";

const MisReservas = () => {
  const { reservas, fetchReservasCliente, loading } = useContext(ReservaContext);
  const { user } = useContext(AuthContext);
  const toast = useRef(null);
  const [showWeather, setShowWeather] = useState(false);
  const [weatherOrigen, setWeatherOrigen] = useState(null);
  const [weatherDestino, setWeatherDestino] = useState(null);

  const handleShowWeather = async (viaje) => {
    try {
      const origen = viaje?.puertoOrigen?.ciudades;
      const destino = viaje?.puertoDestino?.ciudades;
  
      setWeatherOrigen(null);
      setWeatherDestino(null);
      setShowWeather(true);
  
      // Llamar API OpenWeather
      const climaOrigen = await getWeatherByCoords(origen.latitud, origen.longitud);
      const climaDestino = await getWeatherByCoords(destino.latitud, destino.longitud);
  
      setWeatherOrigen({
        nombre: origen.nombre,
        data: climaOrigen,
      });
  
      setWeatherDestino({
        nombre: destino.nombre,
        data: climaDestino,
      });
  
    } catch (error) {
      console.error(error);
    }
  };  

  useEffect(() => {
    if (user?.clienteId) fetchReservasCliente(user.clienteId);
  }, [user]);

  // USEEFFECT PARA VER LA RESERVA COMPLETA
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
        <Tooltip placeholder="Ver Clime" target=".weather-btn" />

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

                  <button 
                    className="export-btn weather-btn"
                    data-pr-tooltip="Ver clima"
                    data-pr-position="top"
                    onClick={() => handleShowWeather(viaje)}
                  >
                    <i className="pi pi-cloud" />
                  </button>

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
        {showWeather && (
          <WeatherModal
            visible={showWeather}
            onHide={() => setShowWeather(false)}
            origen={weatherOrigen}
            destino={weatherDestino}
          />
        )}
      </div>
    </div>
  );
};

export default MisReservas;
