import { useContext, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { ReservaContext } from "../../context/ReservaContext";
import { PagoContext } from "../../context/PagoContext";
import { MedioPagoContext } from "../../context/MedioPagoContext";

import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Steps } from "primereact/steps";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

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

  const ejecutarPago = async () => {
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

  const handlePagar = () => {
    if (!medioPagoId) {
      toast.current.show({
        severity: "warn",
        summary: "Campos incompletos",
        detail: "Selecciona medio de pago",
        life: 2000,
      });
      return;
    }

    confirmDialog({
      message: "¿Confirmas que deseas registrar el pago?",
      header: "Confirmar Pago",
      icon: "pi pi-check-circle",
      acceptLabel: "Confirmar",
      rejectLabel: "Cancelar",
      accept: ejecutarPago
    });
  };

  if (!factura) return <p>Cargando factura...</p>;

  const items = [
    { label: "Viaje" },
    { label: "Servicios" },
    { label: "Pago" },
    { label: "Confirmación" }
  ];

  return (
    <div className="crear-pago-page">
      <Toast ref={toast} />
      <ConfirmDialog />

      {/* STEPS */}
      <div className="steps-container">
        <Steps model={items} activeIndex={2} />
      </div>

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

          {medioPagoId && (
            <div className="medio-seleccionado-box">
              <i className="pi pi-credit-card"></i>
              <span><b>Medio seleccionado:</b> {mediosPago.find(m => m.id === medioPagoId)?.nombre}</span>
            </div>
          )}

          <div className="pago-seguro-box">
            <i className="pi pi-lock"></i>
            Tu pago se procesa de forma encriptada y segura.
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

      {/* CARD DE INFORMACIÓN */}
      <div className="pago-info-banner">
        <h3 className="banner-title">Información importante sobre el pago</h3>
        <p className="banner-text">
          En Nomela Container todos los pagos son procesados mediante sistemas seguros,
          con cifrado de extremo a extremo para proteger tus datos durante la operación.
        </p>
        <p className="banner-text">
          La acreditación del pago puede demorar entre <b>24 y 72 horas hábiles</b>,
          dependiendo del medio seleccionado y la entidad emisora.
          Si el estado no se actualiza dentro del plazo estimado, podés comunicarte con soporte.
        </p>
      </div>

    </div>
  );
};

export default CrearPago;
