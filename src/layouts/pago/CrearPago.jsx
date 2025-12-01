import { useContext, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { ReservaContext } from "../../context/ReservaContext";
import { PagoContext } from "../../context/PagoContext";
import { MedioPagoContext } from "../../context/MedioPagoContext";

import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

import "./CrearPago.css";

const CrearPago = () => {
  const { reservaId } = useParams();
  const navigate = useNavigate();
  const toast = useRef(null);

  const { getFacturaByReserva } = useContext(ReservaContext);
  const { createPago } = useContext(PagoContext);
  const { mediosPago } = useContext(MedioPagoContext);

  const [factura, setFactura] = useState(null);
  const [medioPagoId, setMedioPagoId] = useState(null);

  const montoFijo = 634598;

  useEffect(() => {
    const fetchFactura = async () => {
      const data = await getFacturaByReserva(reservaId);
      setFactura(data);
    };
    fetchFactura();
  }, [reservaId]);

  const handlePagar = async () => {
    if (!medioPagoId) {
      toast.current.show({
        severity: "warn",
        summary: "Campos incompletos",
        detail: "Selecciona medio de pago",
        life: 2000,
      });
      return;
    }

    try {
      await createPago({
        facturaId: factura.id,
        medioPagoId,
        monto: montoFijo,
        fecha: new Date().toISOString(),
        estado: "Pagado",
      });

      toast.current.show({
        severity: "success",
        summary: "Pago registrado",
        detail: "El pago se realizó con éxito",
        life: 2000,
      });

      setTimeout(() => navigate("/"), 900);

    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo registrar el pago",
        life: 2000,
      });
    }
  };

  if (!factura) {
    return <p>Cargando factura...</p>;
  }

  return (
    <div className="crear-pago-page">
      <Toast ref={toast} />

      <div className="crear-pago-container">
        <div className="crear-pago-card">

          <h1 className="pago-title">Registrar Pago – Reserva #{reservaId}</h1>

          <p className="info-text"><b>N° Factura:</b> {factura.numeroFactura}</p>
          <p className="info-text"><b>Fecha Emisión:</b> {factura.fechaEmision.slice(0, 10)}</p>
          <p className="info-text"><b>Monto a pagar:</b> ${montoFijo.toLocaleString("es-AR")}</p>

          <div className="form-group mt-3">
            <label>Medio de Pago</label>
            <Dropdown
              value={medioPagoId}
              options={mediosPago}
              optionLabel="nombre"
              optionValue="id"
              placeholder="Selecciona medio"
              className="w-full container-input mt-1"
              onChange={(e) => setMedioPagoId(e.value)}
            />
          </div>

          <div className="form-buttons mt-4">
            <Button
              label="Volver"
              icon="pi pi-arrow-left"
              className="p-button-secondary w-48"
              onClick={() => navigate(-1)}
            />

            <Button
              label="Registrar Pago"
              icon="pi pi-check"
              className="p-button-success w-48"
              onClick={handlePagar}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default CrearPago;
