import { useContext, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { ServicioAgregadoContext } from "../../context/ServicioAgregadoContext";
import { ReservaServicioContext } from "../../context/ReservaServicioContext";

import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Checkbox } from "primereact/checkbox";

const AgregarServiciosReserva = () => {
  const { reservaId } = useParams();
  const navigate = useNavigate();
  const toast = useRef(null);

  const { serviciosAgregados } = useContext(ServicioAgregadoContext);
  const { createReservaServicio } = useContext(ReservaServicioContext);

  const [seleccionados, setSeleccionados] = useState([]);

  const toggleServicio = (id) => {
    setSeleccionados((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const handleGuardar = async () => {
    if (seleccionados.length === 0) {
      toast.current.show({
        severity: "warn",
        summary: "Atención",
        detail: "Debes seleccionar al menos un servicio",
        life: 2000,
      });
      return;
    }

    try {
      for (const servicioId of seleccionados) {
        await createReservaServicio({
          reservaId: Number(reservaId),
          servicioId,
        });
      }

      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Servicios agregados a la reserva",
        life: 2000,
      });

      setTimeout(() => navigate("/"), 900);

    } catch (e) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron agregar los servicios",
        life: 2500,
      });
    }
  };

  return (
    <div className="agregar-servicios-page">
      <Toast ref={toast} />

      <Card title={`Agregar servicios a la reserva #${reservaId}`} className="p-4 w-10 md:w-6 mx-auto">

        {serviciosAgregados.length === 0 ? (
          <p>No hay servicios disponibles.</p>
        ) : (
          serviciosAgregados.map((s) => (
            <div key={s.id} className="flex align-items-center my-2">
              <Checkbox
                inputId={`serv-${s.id}`}
                checked={seleccionados.includes(s.id)}
                onChange={() => toggleServicio(s.id)}
              />
              <label htmlFor={`serv-${s.id}`} className="ml-2">
                {s.nombre}
              </label>
            </div>
          ))
        )}

        <div className="flex justify-content-between mt-4">
          <Button
            label="Volver"
            icon="pi pi-arrow-left"
            className="p-button-secondary"
            onClick={() => navigate(-1)}
          />

          <Button
            label="Guardar Servicios"
            icon="pi pi-check"
            className="p-button-success"
            onClick={handleGuardar}
          />
        </div>

      </Card>
    </div>
  );
};

export default AgregarServiciosReserva;
