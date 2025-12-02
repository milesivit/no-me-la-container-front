import React from "react";
import { Dialog } from "primereact/dialog";

const WeatherModal = ({ visible, onHide, origen, destino }) => {
  return (
    <Dialog 
      header="Clima del Viaje"
      visible={visible}
      style={{ width: "450px" }}
      onHide={onHide}
    >
      {!origen || !destino ? (
        <p>Cargando clima...</p>
      ) : (
        <div>
          {/* ORIGEN */}
          <h3>Origen: {origen.nombre}</h3>
          <p><b>Temperatura:</b> {origen.data.main.temp}°C</p>
          <p><b>Clima:</b> {origen.data.weather[0].description}</p>
          <p><b>Viento:</b> {origen.data.wind.speed} m/s</p>
          <hr />

          {/* DESTINO */}
          <h3>Destino: {destino.nombre}</h3>
          <p><b>Temperatura:</b> {destino.data.main.temp}°C</p>
          <p><b>Clima:</b> {destino.data.weather[0].description}</p>
          <p><b>Viento:</b> {destino.data.wind.speed} m/s</p>
        </div>
      )}
    </Dialog>
  );
};

export default WeatherModal;
