import { useContext, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { ReservaContext } from "../../context/ReservaContext";
import { FacturaContext } from "../../context/FacturaContext";
import { AuthContext } from "../../context/AuthContext";

import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Checkbox } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";
import { ScrollPanel } from "primereact/scrollpanel";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

import "./CrearReserva.css";

const CrearReserva = () => {
  const { createReserva } = useContext(ReservaContext);
  const { createFactura } = useContext(FacturaContext);
  const { user } = useContext(AuthContext);

  const { viajeContainerId } = useParams();
  const navigate = useNavigate();
  const toast = useRef(null);

  const [aceptaTyC, setAceptaTyC] = useState(false);
  const [showTerminos, setShowTerminos] = useState(false);
  const [showCondiciones, setShowCondiciones] = useState(false);

  const handleCrearReservaFinal = async () => {
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
      clienteId: user.clienteId,
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

  const handleConfirmarReserva = () => {
    confirmDialog({
      message: "¿Confirmas que deseas crear esta reserva?",
      header: "Confirmar Acción",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Confirmar",
      rejectLabel: "Cancelar",
      acceptClassName: "p-button-success",
      rejectClassName: "p-button-secondary",
      accept: () => handleCrearReservaFinal(),
    });
  };

  return (
    <div className="crear-reserva-page">
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className="crear-reserva-container">
        <div className="crear-reserva-card">
          <h1 className="crear-reserva-title">Crear Reserva</h1>

          <p className="info-text">
            <b>ViajeContainer ID:</b> {viajeContainerId}
          </p>

          <p className="info-text">
            <b>Cliente:</b> {user?.nombre} {user?.apellido}
          </p>

          {/* Checkbox Términos y Condiciones */}
          <div className="tyc-container">
            <Checkbox
              checked={aceptaTyC}
              onChange={(e) => setAceptaTyC(e.checked)}
            />

            <span className="tyc-text">
              He leído y acepto los{" "}
              <button className="tyc-link" onClick={() => setShowTerminos(true)}>
                TÉRMINOS
              </button>{" "}
              y{" "}
              <button
                className="tyc-link"
                onClick={() => setShowCondiciones(true)}
              >
                CONDICIONES
              </button>
            </span>
          </div>

          {/* BOTONES */}
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
              disabled={!aceptaTyC}
              onClick={handleConfirmarReserva}
            />
          </div>
        </div>
      </div>

      {/* DIALOG TÉRMINOS */}
      <Dialog
        header="Términos de Uso - Nomela Container"
        visible={showTerminos}
        onHide={() => setShowTerminos(false)}
        closable={false}
        style={{ width: "45rem" }}
        footer={
          <div className="dialog-footer">
            <Button
              label="Cerrar"
              className="p-button-primary"
              onClick={() => setShowTerminos(false)}
            />
          </div>
        }
      >
        <ScrollPanel style={{ height: "320px", paddingRight: "10px" }} className="scroll-celeste">
          <div className="dialog-text">
            <h3>1. Términos de Uso de Nomela Container</h3>

            <p>
              Resumen Informativo de los Términos y Condiciones de uso de{" "}
              <b>Nomela Container</b> (los “Términos y Condiciones”). Nomela
              Container es una unidad de servicios logísticos y digitales que
              ofrece, a través de (i) la plataforma brindada por Nomela
              Container en su sitio web y (ii) la aplicación móvil de Nomela
              Container, determinados servicios vinculados principalmente al
              transporte, manipulación, procesamiento y logística digital de
              cargas, incluyendo:
            </p>

            <p>
              a. el servicio de procesamiento digital de órdenes, reservas,
              movimientos de contenedores, pagos y verificaciones relacionadas a
              operaciones logísticas;
            </p>

            <p>
              b. el ofrecimiento de una cuenta de usuario gratuita, que permite
              —entre otras funcionalidades— realizar y recibir notificaciones,
              gestionar encuestas de tracking de carga, acceder a historial de
              operaciones, revisar estados actuales y emitir solicitudes de
              movimientos;
            </p>

            <p>
              c. el servicio de operación logística digital en tiempo real, que
              permite coordinar remitos, ingresos y retiros de contenedores,
              actualizaciones de estado, estimaciones de entrega, sincronización
              con puertos y canales habilitados; y realizar operaciones
              utilizando la información disponible en la cuenta.
            </p>

            <p>
              Asimismo, los usuarios podrán acceder a herramientas
              complementarias vinculadas a transporte marítimo, documentación
              operativa, e interacciones con agentes y operadores habilitados.
              Los cargos y comisiones aplicables por los servicios que Nomela
              Container ofrezca están detallados en los Términos y Condiciones y
              sus anexos.
            </p>

            <p>
              Para poder operar en los servicios, los Usuarios deberán aceptar
              los Términos y Condiciones, los anexos y la Declaración de
              Privacidad, así como cumplir los requisitos mínimos de información
              e identificación requeridos por la normativa vigente para operar
              dentro de plataformas de logística digital.
            </p>

            <h3>1. Registro de Cuentas</h3>

            <p>
              1.1. <b>Registro.</b> Todo Usuario que desee utilizar los Servicios debe
              registrarse dentro de Nomela Container y aceptar los presentes
              Términos y Condiciones. Para registrarse, es obligatorio completar
              el formulario de registro con datos verídicos y exactos. El
              Usuario se compromete a actualizar sus datos cuando sea necesario
              y garantiza su autenticidad.
            </p>

            <p>
              Nomela Container podrá solicitar documentación adicional para
              verificar la identidad del Usuario, así como suspender o cancelar
              cuentas cuyos datos no puedan ser verificados. El Usuario declara
              y acepta que Nomela Container podrá compartir información con
              empresas del mismo grupo económico cuando sea necesario para
              cumplir obligaciones regulatorias o de seguridad.
            </p>

            <p>
              1.2. <b>Cuenta Nomela Container.</b> La cuenta creada permitirá al
              Usuario utilizar los Servicios. El Usuario accederá mediante su
              correo electrónico y contraseña, siendo el único responsable por
              las operaciones realizadas en su cuenta.
            </p>

            <p>
              1.3. <b>Capacidad.</b> Solo podrán registrarse personas con capacidad
              legal para contratar. Menores de edad solo podrán utilizar el
              servicio con la autorización de un representante legal.
            </p>

            <p>
              1.4. <b>Cuentas para Menores Autorizados.</b> Los menores autorizados
              podrán operar únicamente bajo supervisión del representante legal.
              Nomela Container podrá suspender cuentas de menores ante cualquier
              irregularidad.
            </p>
          </div>
        </ScrollPanel>
      </Dialog>

      {/* DIALOG CONDICIONES */}
      <Dialog
        header="Condiciones del Servicio - Nomela Container"
        visible={showCondiciones}
        onHide={() => setShowCondiciones(false)}
        closable={false}
        style={{ width: "45rem" }}
        footer={
          <div className="dialog-footer">
            <Button
              label="Cerrar"
              className="p-button-primary"
              onClick={() => setShowCondiciones(false)}
            />
          </div>
        }
      >
        <ScrollPanel style={{ height: "320px", paddingRight: "10px" }} className="scroll-celeste">
          <div className="dialog-text">
            <h3>2. Condiciones del Servicio de Nomela Container</h3>

            <p>
              2.1. <b>Servicio de Procesamiento Logístico.</b> Nomela Container
              brinda el servicio de procesamiento, coordinación y actualización
              de movimientos de contenedores, transacciones logísticas y estados
              de carga, que pueden involucrar distintos medios operativos y
              agentes vinculados al transporte marítimo, terrestre y portuario.
            </p>

            <p>
              2.2. <b>Instrucciones.</b> Al utilizar los Servicios, el Usuario
              instruye a Nomela Container respecto a operaciones de movimiento,
              reservas, pagos asociados, liberación, seguimiento y destino, de
              acuerdo con la información cargada y aprobada dentro del sistema.
            </p>

            <p>
              2.3. <b>Celebración de Solicitudes.</b> Una solicitud logística se
              considerará válida cuando el Usuario ingrese una instrucción a
              través de la plataforma. Nomela Container podrá rechazar
              solicitudes incompletas o inconsistentes.
            </p>

            <p>
              2.4. <b>Perfeccionamiento de la Solicitud.</b> La solicitud no se
              considerará aceptada hasta que Nomela Container confirme la
              operación y verifique la disponibilidad de recursos, unidades,
              contingentes o tiempos operativos.
            </p>

            <p>
              2.5. <b>Estados y Acreditación.</b> Los estados de las cargas y
              movimientos se actualizarán conforme a los plazos operativos
              estipulados y de acuerdo con la normativa vigente o las reglas
              internas de operación logística.
            </p>

            <p>
              2.6. <b>Responsabilidad del Usuario.</b> El Usuario es responsable
              por proporcionar datos correctos de carga, destino, origen,
              dimensiones, tipo de contenedor, condición y documentación
              asociada.
            </p>

            <p>
              2.7. <b>Responsabilidad de Nomela Container.</b> Nomela Container no
              será responsable por daños derivados de información incorrecta
              provista por el Usuario, ni por eventos de fuerza mayor,
              decisiones portuarias o aduaneras, contingencias climáticas,
              huelgas, cierres operativos o cualquier situación que escape a su
              control directo.
            </p>

            <p>
              2.8. <b>Uso Correcto del Servicio.</b> El Usuario se compromete a no
              utilizar los Servicios para actividades ilícitas, fraudulentas,
              simuladas o peligrosas, ni para operaciones no vinculadas a
              procesos logísticos reales.
            </p>

            <p>
              2.9. <b>Límites.</b> Nomela Container podrá establecer límites
              máximos o restricciones operativas basadas en capacidad,
              disponibilidad, seguridad o revisión documental según la normativa
              vigente.
            </p>

            <p>
              2.10. <b>Reversiones y Contratiempos.</b> En caso de reversiones,
              rechazos de puertos, aduanas o terceros operadores, el Usuario
              será responsable por los costos derivados de tales procesos.
            </p>

            <p>
              2.11. <b>Promociones o Beneficios.</b> Si el Usuario accede a
              beneficios operativos especiales, estos deberán ser informados
              correctamente. Nomela Container no será responsable por acuerdos
              externos no informados.
            </p>

            <p>
              2.12. <b>Herramientas Digitales.</b> El Usuario es responsable de
              la veracidad del contenido que cargue al sistema, así como por la
              protección y uso de sus credenciales.
            </p>

            <p>
              2.13. <b>Pagos Internacionales o Aduaneros.</b> Cuando aplique, las
              operaciones dependerán del tipo de cambio, normativa vigente y
              aranceles aplicados por terceros organismos externos a Nomela
              Container.
            </p>
          </div>
        </ScrollPanel>
      </Dialog>
    </div>
  );
};

export default CrearReserva;
