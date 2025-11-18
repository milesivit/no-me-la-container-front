import { useContext, useRef } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { InputMask } from "primereact/inputmask";
import { Dropdown } from "primereact/dropdown";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";

import { ViajeContext } from "../../context/ViajeContext";
import { PuertoContext } from "../../context/PuertoContext";
import { BarcoContext } from "../../context/BarcoContext";
import { ViajeEstadoContext } from "../../context/ViajeEstadoContext";

import { useNavigate } from "react-router-dom";
import "./CreateViaje.css";

const CreateViaje = () => {
  const { createViaje } = useContext(ViajeContext);
  const { puertos } = useContext(PuertoContext);
  const { barcos } = useContext(BarcoContext);
  const { viajeEstados } = useContext(ViajeEstadoContext);

  const toast = useRef(null);
  const navigate = useNavigate();

  // -----------------------------
  // 🔧 Helpers Fecha
  // -----------------------------
  const normalizarFecha = (valor) => {
    if (!valor) return "";
    const [d, m, y] = valor.split("/");
    return `${y}-${m}-${d}`;
  };

  const initialValues = {
    puertoOrigenId: "",
    puertoDestinoId: "",
    fechaSalida: "",
    promesaDeEntrega: "",
    viajeEstadoID: "",
    barco: "",
  };

  const validationSchema = Yup.object({
    puertoOrigenId: Yup.number().required("Campo requerido"),
    puertoDestinoId: Yup.number().required("Campo requerido"),
    fechaSalida: Yup.string().required("Campo requerido"),
    promesaDeEntrega: Yup.string().required("Campo requerido"),
    viajeEstadoID: Yup.number().required("Campo requerido"),
    barco: Yup.number().required("Campo requerido"),
  });

  const onSubmit = async (values, { resetForm }) => {
    const payload = {
      ...values,
      fechaSalida: normalizarFecha(values.fechaSalida),
      promesaDeEntrega: normalizarFecha(values.promesaDeEntrega),
    };

    try {
      await createViaje(payload);

      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Viaje creado correctamente",
        life: 3000,
      });

      resetForm();
      setTimeout(() => navigate("/viaje"), 1000);

    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo crear el viaje",
        life: 3000,
      });
    }
  };

  return (
    <div className="create-viaje-page">
      <Toast ref={toast} />

      <div className="create-viaje-container">
        <Card title="Registrar Viaje" className="create-viaje-card">

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ setFieldValue, values }) => (
              <Form className="create-viaje-form">

                {/* ORIGEN */}
                <div className="form-group">
                  <label>Puerto Origen</label>
                  <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-map-marker"></i>
                    </span>

                    <Dropdown
                      value={values.puertoOrigenId}
                      options={puertos.map((p) => ({ label: p.nombre, value: p.id }))}
                      placeholder="Seleccione origen"
                      onChange={(e) => setFieldValue("puertoOrigenId", e.value)}
                    />
                  </div>

                  <ErrorMessage name="puertoOrigenId" component="span" className="error-text" />
                </div>

                {/* DESTINO */}
                <div className="form-group">
                  <label>Puerto Destino</label>
                  <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-map-marker"></i>
                    </span>

                    <Dropdown
                      value={values.puertoDestinoId}
                      options={puertos.map((p) => ({ label: p.nombre, value: p.id }))}
                      placeholder="Seleccione destino"
                      onChange={(e) => setFieldValue("puertoDestinoId", e.value)}
                    />
                  </div>

                  <ErrorMessage name="puertoDestinoId" component="span" className="error-text" />
                </div>

                {/* FECHA SALIDA */}
                <div className="form-group">
                  <label>Fecha de Salida</label>
                  <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-calendar"></i>
                    </span>

                    <InputMask
                      mask="99/99/9999"
                      placeholder="dd/mm/aaaa"
                      value={values.fechaSalida}
                      onChange={(e) => setFieldValue("fechaSalida", e.value)}
                    />
                  </div>

                  <ErrorMessage name="fechaSalida" component="span" className="error-text" />
                </div>

                {/* FECHA LLEGADA */}
                <div className="form-group">
                  <label>Promesa de Entrega</label>
                  <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-calendar"></i>
                    </span>

                    <InputMask
                      mask="99/99/9999"
                      placeholder="dd/mm/aaaa"
                      value={values.promesaDeEntrega}
                      onChange={(e) => setFieldValue("promesaDeEntrega", e.value)}
                    />
                  </div>

                  <ErrorMessage name="promesaDeEntrega" component="span" className="error-text" />
                </div>

                {/* ESTADO */}
                <div className="form-group">
                  <label>Estado del Viaje</label>
                  <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-flag"></i>
                    </span>

                    <Dropdown
                      value={values.viajeEstadoID}
                      options={viajeEstados.map((e) => ({ label: e.nombre, value: e.id }))}
                      placeholder="Seleccione estado"
                      onChange={(e) => setFieldValue("viajeEstadoID", e.value)}
                    />
                  </div>

                  <ErrorMessage name="viajeEstadoID" component="span" className="error-text" />
                </div>

                {/* BARCO */}
                <div className="form-group">
                  <label>Barco</label>
                  <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-compass"></i>
                    </span>

                    <Dropdown
                      value={values.barco}
                      options={barcos.map((b) => ({ label: b.nombre, value: b.id }))}
                      placeholder="Seleccione barco"
                      onChange={(e) => setFieldValue("barco", e.value)}
                    />
                  </div>

                  <ErrorMessage name="barco" component="span" className="error-text" />
                </div>

                {/* BOTONES */}
                <div className="form-buttons flex gap-2 mt-4">
                  <Button
                    label="Volver"
                    icon="pi pi-arrow-left"
                    className="p-button-secondary w-48"
                    type="button"
                    onClick={() => navigate("/viaje")}
                  />

                  <Button
                    type="submit"
                    label="Guardar"
                    icon="pi pi-check"
                    className="p-button-success w-48"
                  />
                </div>

              </Form>
            )}
          </Formik>

        </Card>
      </div>
    </div>
  );
};

export default CreateViaje;
