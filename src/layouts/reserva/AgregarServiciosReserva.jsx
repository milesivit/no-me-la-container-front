import { useContext, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { ServicioAgregadoContext } from "../../context/ServicioAgregadoContext";
import { ReservaServicioContext } from "../../context/ReservaServicioContext";
import { AuthContext } from "../../context/AuthContext";

import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Checkbox } from "primereact/checkbox";
import { Steps } from "primereact/steps";
import { Carousel } from "primereact/carousel";

import "./AgregarServiciosReserva.css";

const AgregarServiciosReserva = () => {
  const { reservaId } = useParams();
  const navigate = useNavigate();
  const toast = useRef(null);

  const { serviciosAgregados } = useContext(ServicioAgregadoContext);
  const { createReservaServicio } = useContext(ReservaServicioContext);
  const { user } = useContext(AuthContext);

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

  const items = [
    { label: "Viaje" },
    { label: "Servicios" },
    { label: "Pago" },
    { label: "Confirmación" }
  ];

  const beneficios = [
    { titulo: "Inspección 24hs", icono: "pi pi-search", texto: "Supervisión constante del container." },
    { titulo: "Seguimiento Satelital", icono: "pi pi-globe", texto: "Tracking en tiempo real de la carga." },
    { titulo: "Prioridad de Embarque", icono: "pi pi-send", texto: "Procesamiento más rápido." },
    { titulo: "Soporte Premium", icono: "pi pi-headphones", texto: "Atención personalizada." }
  ];

  const plantillaBeneficio = (item) => (
    <div className="carousel-card">
      <i className={`${item.icono} carousel-icon`}></i>
      <h4>{item.titulo}</h4>
      <p>{item.texto}</p>
    </div>
  );

  const recomendados = [
    "Limpieza profunda",
    "Candado reforzado",
    "Desinfección",
    "Mantenimiento rápido"
  ];

  return (
    <div className="agregar-servicios-page">
      <Toast ref={toast} />

      <div className="steps-container">
        <Steps model={items} activeIndex={1} />
      </div>

      <div className="layout-grid">

        {/* IZQUIERDA */}
        <div className="main-card">

          <h1 className="servicios-title">
            Agregar Servicios a la Reserva #{reservaId}
          </h1>

          {/* NUEVO SUBTÍTULO */}
          <h2 className="subtitulo-seccion">Beneficios Increíbles</h2>

          <Carousel
            value={beneficios}
            numVisible={2}
            numScroll={1}
            itemTemplate={plantillaBeneficio}
            className="beneficios-carousel"
          />

          {/* NUEVO SUBTÍTULO */}
          <h2 className="subtitulo-seccion mt-4">Lista de Servicios Agregados</h2>

          <div className="lista-servicios-pro">
            {serviciosAgregados.map((s) => (
              <div key={s.id} className="servicio-card-pro">
                <div className="serv-card-content">
                  <div className="serv-info">
                    <i className="pi pi-star-fill serv-icon"></i>
                    <div>
                      <h4>{s.nombre}</h4>
                      <p>Servicio adicional exclusivo.</p>
                    </div>
                  </div>

                  <Checkbox
                    checked={seleccionados.includes(s.id)}
                    onChange={() => toggleServicio(s.id)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="recomendados-box">
            <h3>Recomendados para tu tipo de viaje</h3>
            <ul>
              {recomendados.map((r, i) => (
                <li key={i}><i className="pi pi-check"></i> {r}</li>
              ))}
            </ul>
          </div>

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

        {/* DERECHA */}
        <div className="sidebar-detalles">
          <h3>Detalle de la Reserva</h3>
          <p><b>Cliente:</b> {user?.nombre} {user?.apellido}</p>
          <p><b>ID Reserva:</b> {reservaId}</p>
          <p><b>Servicios seleccionados:</b> {seleccionados.length}</p>

          <div className="sidebar-box">
            <i className="pi pi-info-circle"></i>
            Recuerda que algunos servicios requieren verificación adicional.
          </div>
        </div>

      </div>
    </div>
  );
};

export default AgregarServiciosReserva;
