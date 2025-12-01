import { useContext, useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ViajeContext } from "../../context/ViajeContext";
import viajeContainerService from "../../services/viajeContainerService";

import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

import "./AsignarViaje.css";

const AsignarViaje = () => {
  const { viajes, fetchViajes } = useContext(ViajeContext);

  const { id: cargaContainerId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const toast = useRef(null);

  const containerId = location.state?.containerId;
  const [viajeId, setViajeId] = useState(null);

  useEffect(() => {
    fetchViajes();
  }, []);

  const viajeSel = viajes.find((v) => v.id === viajeId);

  const handleAsignar = async () => {
    if (!viajeId) {
      toast.current.show({
        severity: "warn",
        summary: "Atención",
        detail: "Debes seleccionar un viaje",
        life: 3000,
      });
      return;
    }

    const payload = {
      viajeId,
      containerId,
      cargaContainerId: Number(cargaContainerId),
    };

    try {
      const response = await viajeContainerService.create(payload);
      const viajeContainerCreado = response.data.data;

      navigate(`/reserva/crear/${viajeContainerCreado.id}`);

      toast.current.show({
        severity: "success",
        summary: "Asignado",
        detail: "El viaje fue asignado correctamente",
        life: 2500,
      });

    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response?.data?.message || "No se pudo asignar el viaje",
        life: 3000,
      });
    }
  };

  return (
    <div className="asignar-viaje-page">
      <Toast ref={toast} />

      <div className="asignar-viaje-container">
        <div className="asignar-viaje-card">

          <h1 className="asignar-title">Asignar Viaje a la Carga</h1>

          <p className="info-text"><b>Carga Container ID:</b> {cargaContainerId}</p>
          <p className="info-text"><b>Container ID:</b> {containerId}</p>

          <div className="form-group mt-3">
            <label className="font-semibold">Seleccionar Viaje</label>

            <Dropdown
              value={viajeId}
              onChange={(e) => setViajeId(e.value)}
              placeholder="Selecciona un viaje"
              className="w-full container-input mt-1"
              options={viajes.map((v) => ({
                label: `${v.puertoOrigen?.nombre} → ${v.puertoDestino?.nombre} (Salida: ${new Date(
                  v.fechaSalida
                ).toLocaleDateString()})`,
                value: v.id,
              }))}
            />
          </div>

          <div className="form-buttons mt-5">
            <Button
              label="Volver"
              icon="pi pi-arrow-left"
              className="p-button-secondary w-48"
              onClick={() => navigate(-1)}
            />

            <Button
              label="Asignar"
              icon="pi pi-check"
              className="p-button-success w-48"
              onClick={handleAsignar}
            />
          </div>

          {/* TIMELINE */}
          {viajeSel && (
            <div className="timeline-wrapper mt-5">
              <h3 className="timeline-title">Ruta del Viaje Seleccionado</h3>

              <div className="timeline">

                <div className="timeline-item">
                  <div className="circle"></div>
                  <div className="timeline-card">
                    <b>Origen</b>
                    <p>{viajeSel.puertoOrigen?.nombre}</p>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="circle"></div>
                  <div className="timeline-card">
                    <b>Salida</b>
                    <p>{new Date(viajeSel.fechaSalida).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="circle"></div>
                  <div className="timeline-card">
                    <b>Promesa de Entrega</b>
                    <p>
                      {viajeSel.promesaDeEntrega
                        ? new Date(viajeSel.promesaDeEntrega).toLocaleDateString()
                        : "Sin fecha definida"}
                    </p>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="circle"></div>
                  <div className="timeline-card">
                    <b>Destino</b>
                    <p>{viajeSel.puertoDestino?.nombre}</p>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AsignarViaje;
