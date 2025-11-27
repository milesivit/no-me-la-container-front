import { useContext, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { ServicioAgregadoContext } from "../../context/ServicioAgregadoContext";
import { ReservaServicioContext } from "../../context/ReservaServicioContext";

import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Checkbox } from "primereact/checkbox";

import "./AgregarServiciosReserva.css";

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

      setTimeout(() => navigate(`/pago/crear/${reservaId}`), 900);

    } catch {
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

      <div className="agregar-servicios-container">
        <div className="agregar-servicios-card">

          <h1 className="servicios-title">
            Agregar Servicios a la Reserva #{reservaId}
          </h1>

          {serviciosAgregados.length === 0 ? (
            <p className="texto-info">No hay servicios disponibles.</p>
          ) : (
            <div className="lista-servicios">
              {serviciosAgregados.map((s) => (
                <div key={s.id} className="servicio-item">
                  <Checkbox
                    inputId={`serv-${s.id}`}
                    checked={seleccionados.includes(s.id)}
                    onChange={() => toggleServicio(s.id)}
                  />
                  <label htmlFor={`serv-${s.id}`} className="servicio-label">
                    {s.nombre}
                  </label>
                </div>
              ))}
            </div>
          )}

          <div className="form-buttons mt-4">
            <Button
              label="Volver"
              icon="pi pi-arrow-left"
              className="p-button-secondary w-48"
              onClick={() => navigate(-1)}
            />

            <Button
              label="Guardar Servicios"
              icon="pi pi-check"
              className="p-button-success w-48"
              onClick={handleGuardar}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default AgregarServiciosReserva;
