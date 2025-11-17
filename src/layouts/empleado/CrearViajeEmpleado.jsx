import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ViajeEmpleadoContext } from "../../context/ViajeEmpleadoContext";
import { ViajeContext } from "../../context/ViajeContext";

import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

import "./CrearViajeEmpleado.css";

const CrearViajeEmpleado = () => {
  const { id: empleadoId } = useParams();
  const navigate = useNavigate();

  const { createViajeEmpleado } = useContext(ViajeEmpleadoContext);
  const { viajes, fetchViajes } = useContext(ViajeContext);

  const [viajeId, setViajeId] = useState(null);

  useEffect(() => {
    fetchViajes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!viajeId) {
      alert("Debes seleccionar un viaje");
      return;
    }

    await createViajeEmpleado({
      viajeId: Number(viajeId),
      empleadoId: Number(empleadoId),
    });

    navigate(`/empleado/viajes/${empleadoId}`);
  };

  return (
    <div className="viajeempleadocrear-page">
      <div className="viajeempleadocrear-container">

        <Card className="viajeempleadocrear-card" title="Asignar Viaje al Empleado">
          <p className="viajeempleadocrear-info">
            <b>Empleado ID:</b> {empleadoId}
          </p>

          <form onSubmit={handleSubmit} className="p-fluid">

            <div className="field">
              <label htmlFor="viajeId">Seleccionar viaje</label>
              <Dropdown
                id="viajeId"
                value={viajeId}
                options={viajes.map((v) => ({
                  label: `#${v.id} - ${v.barcos?.nombre} (${v.puertoOrigen?.nombre} → ${v.puertoDestino?.nombre})`,
                  value: v.id,
                }))}
                onChange={(e) => setViajeId(e.value)}
                placeholder="Elegir viaje"
                filter
                className="viajeempleadocrear-dropdown"
              />
            </div>

            <Button
              label="Asignar viaje"
              icon="pi pi-check"
              className="p-button-success viajeempleadocrear-submit"
              type="submit"
            />

            <Button
              label="Volver"
              icon="pi pi-arrow-left"
              className="p-button-text viajeempleadocrear-back"
              onClick={() => navigate(-1)}
            />
          </form>
        </Card>

      </div>
    </div>
  );
};

export default CrearViajeEmpleado;
