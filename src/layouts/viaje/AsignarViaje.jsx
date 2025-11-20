import { useContext, useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ViajeContext } from "../../context/ViajeContext";
import viajeContainerService from "../../services/viajeContainerService";

import { Dropdown } from "primereact/dropdown";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

const AsignarViaje = () => {
  const { viajes, fetchViajes } = useContext(ViajeContext);

  const { id: cargaContainerId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const toast = useRef(null);

  const containerId = location.state?.containerId;

  const [viajeId, setViajeId] = useState(null);

  // cargar viajes
  useEffect(() => {
    fetchViajes();
  }, []);

  useEffect(() => {
    console.log("VIAJES DISPONIBLES:", viajes);
  }, [viajes]);

  const handleAsignar = async () => {
    console.log("➡ VIAJE SELECCIONADO:", viajeId);
  
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
      viajeId: viajeId,
      containerId: containerId,
      cargaContainerId: Number(cargaContainerId),
    };
  
    try {
      await viajeContainerService.create(payload);
  
      toast.current.show({
        severity: "success",
        summary: "Asignado",
        detail: "El viaje fue asignado correctamente",
        life: 2500,
      });
  
      setTimeout(() => navigate("/"), 600);
  
    } catch (error) {
      console.error("ERROR BACK:", error.response?.data || error);
  
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

      <Card title="Asignar Viaje a la Carga" className="p-4 w-10 md:w-6 mx-auto">

        <p><b>Carga Container ID:</b> {cargaContainerId}</p>
        <p><b>Container ID:</b> {containerId}</p>

        <div className="mt-4">
          <label className="font-semibold">Seleccionar Viaje</label>

          <Dropdown
            value={viajeId}
            onChange={(e) => {
              console.log("🟦 VIAJE SELECCIONADO EN DROPDOWN:", e.value);
              setViajeId(e.value);
            }}
            placeholder="Selecciona un viaje"
            className="w-full mt-2"
            options={viajes.map((v) => ({
              label: `${v.puertoOrigen?.nombre} → ${v.puertoDestino?.nombre} (Salida: ${new Date(v.fechaSalida).toLocaleDateString()})`,
              value: v.id,
            }))}
          />
        </div>

        <div className="flex justify-content-between mt-5">
          <Button
            label="Volver"
            icon="pi pi-arrow-left"
            className="p-button-secondary"
            onClick={() => navigate(-1)}
          />

          <Button
            label="Asignar"
            icon="pi pi-check"
            className="p-button-success"
            onClick={handleAsignar}
          />
        </div>

      </Card>
    </div>
  );
};

export default AsignarViaje;
