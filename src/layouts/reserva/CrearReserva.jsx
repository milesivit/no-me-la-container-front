import { useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ReservaContext } from "../../context/ReservaContext";
import { FacturaContext } from "../../context/FacturaContext";
import { AuthContext } from "../../context/AuthContext";

import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

const CrearReserva = () => {
  const { createReserva } = useContext(ReservaContext);
  const { createFactura } = useContext(FacturaContext);
  const { user } = useContext(AuthContext); //usuario logueado

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
      clienteId: user.id, //AUTOMÁTICO
      viajeContainerId: Number(viajeContainerId),
      fechaReserva: new Date().toISOString().split("T")[0],
      reservaEstadoId: 1, //SIEMPRE 1
    };

    try {
      //se crea reserva
      const resCreada = await createReserva(payload);

      //se crea factura
      const numeroRandom = Math.floor(100000 + Math.random() * 900000);
      const hoy = new Date();
      const vencimiento = new Date();
      vencimiento.setDate(hoy.getDate() + 30);

      await createFactura({
        numeroFactura: numeroRandom.toString(),
        reservaId: resCreada.id,      //SE USA LA RESERVA CREADA
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

    } catch (e) {
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

      <Card title="Crear Reserva" className="p-4 w-10 md:w-6 mx-auto">

        <p><b>ViajeContainer ID:</b> {viajeContainerId}</p>
        <p><b>Cliente:</b> {user?.nombre} {user?.apellido}</p>

        <div className="flex justify-content-between mt-5">
          <Button
            label="Volver"
            icon="pi pi-arrow-left"
            className="p-button-secondary"
            onClick={() => navigate(-1)}
          />

          <Button
            label="Crear Reserva"
            icon="pi pi-check"
            className="p-button-success"
            onClick={handleCrearReserva}
          />
        </div>

      </Card>
    </div>
  );
};

export default CrearReserva;
