import { useContext, useRef } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { ServicioAgregadoContext } from "../../context/ServicioAgregadoContext";
import { useNavigate } from "react-router-dom";

import "./CrearServicioAgregado.css"; // 👉 Asegúrate de usar tu archivo CSS

const CrearServicioAgregado = () => {
  const { createServicioAgregado } = useContext(ServicioAgregadoContext);
  const toast = useRef(null);
  const navigate = useNavigate();

  const initialValues = {
    nombre: "",
    codServicio: "",
    coste: "",
  };

  const validationSchema = Yup.object({
    nombre: Yup.string().required("Campo requerido"),
    codServicio: Yup.string().required("Campo requerido"),
    coste: Yup.number()
      .typeError("Debe ser un número")
      .min(1, "Debe ser mayor que 0")
      .required("Campo requerido"),
  });

  const onSubmit = async (values, { resetForm }) => {
    try {
      await createServicioAgregado(values);

      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Servicio agregado creado correctamente",
        life: 3000,
      });

      resetForm();
      setTimeout(() => navigate("/servicio"), 1000);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo crear el servicio",
        life: 3000,
      });
    }
  };

  return (
    <div className="create-container-page">
      <Toast ref={toast} />

      <div className="create-container-container">
        <div className="create-container-card">
          <h2 className="card-title">Crear Servicio Agregado</h2>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ setFieldValue, values }) => (
              <Form className="create-container-form">
                
                {/* Nombre */}
                <div className="form-group">
                  <label htmlFor="nombre">Nombre</label>
                  <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-tag"></i>
                    </span>
                    <InputText
                      id="nombre"
                      name="nombre"
                      className="create-container-input"
                      value={values.nombre}
                      onChange={(e) => setFieldValue("nombre", e.target.value)}
                      placeholder="Ingrese nombre"
                    />
                  </div>
                  <ErrorMessage name="nombre" component="span" className="error-text" />
                </div>

                {/* Código */}
                <div className="form-group">
                  <label htmlFor="codServicio">Código</label>
                  <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-key"></i>
                    </span>
                    <InputText
                      id="codServicio"
                      name="codServicio"
                      className="create-container-input"
                      value={values.codServicio}
                      onChange={(e) => setFieldValue("codServicio", e.target.value)}
                      placeholder="Ingrese código"
                    />
                  </div>
                  <ErrorMessage name="codServicio" component="span" className="error-text" />
                </div>

                {/* Coste */}
                <div className="form-group">
                  <label htmlFor="coste">Coste</label>
                  <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">$</span>
                    <InputText
                      id="coste"
                      name="coste"
                      className="create-container-input"
                      value={values.coste}
                      onChange={(e) => setFieldValue("coste", e.target.value)}
                      placeholder="Ingrese coste"
                      keyfilter="num"
                    />
                  </div>
                  <ErrorMessage name="coste" component="span" className="error-text" />
                </div>

                {/* BOTONES */}
                <div className="form-buttons flex gap-2 mt-4">
                  <Button
                    label="Volver"
                    icon="pi pi-arrow-left"
                    className="p-button-secondary w-48"
                    type="button"
                    onClick={() => navigate("/servicio")}
                  />
                  <Button
                    type="submit"
                    label="Crear Servicio"
                    icon="pi pi-check"
                    className="p-button-success w-48"
                  />
                </div>

              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default CrearServicioAgregado;
