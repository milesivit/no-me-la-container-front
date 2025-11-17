import { useContext, useRef } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { InputText } from "primereact/inputtext";
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
    try {
      await createViaje(values);

      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Viaje creado correctamente",
        life: 3000,
      });

      resetForm();
      setTimeout(() => navigate("/viaje"), 1000);
    } catch (error) {
      console.error("Error al crear viaje:", error);

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
            {({ values, handleChange, setFieldValue }) => (
              <Form className="create-viaje-form">

                {/* ORIGEN */}
                <div className="form-group">
                  <label>Puerto Origen</label>
                  <Dropdown
                    value={values.puertoOrigenId}
                    options={puertos.map((p) => ({
                      label: p.nombre,
                      value: p.id,
                    }))}
                    onChange={(e) => setFieldValue("puertoOrigenId", e.value)}
                    placeholder="Seleccione origen"
                    filter
                  />
                  <ErrorMessage name="puertoOrigenId" component="span" className="error-text" />
                </div>

                {/* DESTINO */}
                <div className="form-group">
                  <label>Puerto Destino</label>
                  <Dropdown
                    value={values.puertoDestinoId}
                    options={puertos.map((p) => ({
                      label: p.nombre,
                      value: p.id,
                    }))}
                    onChange={(e) => setFieldValue("puertoDestinoId", e.value)}
                    placeholder="Seleccione destino"
                    filter
                  />
                  <ErrorMessage name="puertoDestinoId" component="span" className="error-text" />
                </div>

                {/* FECHA SALIDA */}
                <div className="form-group">
                  <label>Fecha de Salida</label>
                  <InputText
                    type="date"
                    name="fechaSalida"
                    value={values.fechaSalida}
                    onChange={handleChange}
                  />
                  <ErrorMessage name="fechaSalida" component="span" className="error-text" />
                </div>

                {/* FECHA LLEGADA */}
                <div className="form-group">
                  <label>Promesa de Entrega</label>
                  <InputText
                    type="date"
                    name="promesaDeEntrega"
                    value={values.promesaDeEntrega}
                    onChange={handleChange}
                  />
                  <ErrorMessage name="promesaDeEntrega" component="span" className="error-text" />
                </div>

                {/* ESTADO */}
                <div className="form-group">
                  <label>Estado del Viaje</label>
                  <Dropdown
                    value={values.viajeEstadoID}
                    options={viajeEstados.map((es) => ({
                      label: es.nombre,
                      value: es.id,
                    }))}
                    onChange={(e) => setFieldValue("viajeEstadoID", e.value)}
                    placeholder="Seleccione estado"
                    filter
                  />
                  <ErrorMessage name="viajeEstadoID" component="span" className="error-text" />
                </div>

                {/* BARCO */}
                <div className="form-group">
                  <label>Barco</label>
                  <Dropdown
                    value={values.barco}
                    options={barcos.map((b) => ({
                      label: b.nombre,
                      value: b.id,
                    }))}
                    onChange={(e) => setFieldValue("barco", e.value)}
                    placeholder="Seleccione barco"
                    filter
                  />
                  <ErrorMessage name="barco" component="span" className="error-text" />
                </div>

                {/* BOTONES */}
                <div className="form-buttons">
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
