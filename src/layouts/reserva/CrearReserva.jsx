import { useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ReservaContext } from "../../context/ReservaContext";
import { FacturaContext } from "../../context/FacturaContext";
import { AuthContext } from "../../context/AuthContext";

import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

import "./CrearReserva.css";

const CrearReserva = () => {
  const { createReserva } = useContext(ReservaContext);
  const { createFactura } = useContext(FacturaContext);
  const { user } = useContext(AuthContext);

  const { viajeContainerId } = useParams();
  const navigate = useNavigate();
  const toast = useRef(null);

  const handleCrearReserva = async () => {
    if (!user?.id) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo identificar al cliente logueado",
        life: 2000,
      });
      return;
    }

    const payload = {
      clienteId: user.id,
      viajeContainerId: Number(viajeContainerId),
      fechaReserva: new Date().toISOString().split("T")[0],
      reservaEstadoId: 1,
    };

    try {
      const resCreada = await createReserva(payload);

      const numeroRandom = Math.floor(100000 + Math.random() * 900000);
      const hoy = new Date();
      const vencimiento = new Date();
      vencimiento.setDate(hoy.getDate() + 30);

      await createFactura({
        numeroFactura: numeroRandom.toString(),
        reservaId: resCreada.id,
        fechaEmision: hoy.toISOString(),
        fechaVencimiento: vencimiento.toISOString(),
        observacion: "Reserva generada automáticamente",
        facturaEstadoId: 1,
      });

      toast.current.show({
        severity: "success",
        summary: "Reserva creada",
        detail: "La reserva fue creada exitosamente",
        life: 2000,
      });

      setTimeout(() => navigate(`/reserva/servicios/${resCreada.id}`), 900);

    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo crear la reserva",
        life: 2500,
      });
    }
  };

  return (
    <div className="crear-reserva-page">
      <Toast ref={toast} />

      <div className="crear-reserva-container">
        <div className="crear-reserva-card">

          <h1 className="crear-reserva-title">Crear Reserva</h1>

          <p className="info-text"><b>ViajeContainer ID:</b> {viajeContainerId}</p>
          <p className="info-text"><b>Cliente:</b> {user?.nombre} {user?.apellido}</p>

          <div className="form-buttons mt-4">
            <Button
              label="Volver"
              icon="pi pi-arrow-left"
              className="p-button-secondary w-48"
              onClick={() => navigate(-1)}
            />

            <Button
              label="Crear Reserva"
              icon="pi pi-check"
              className="p-button-success w-48"
              onClick={handleCrearReserva}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default CrearReserva;
