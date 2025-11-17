import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRef, useContext } from "react";
import { ContainerEstadoContext } from "../../context/ContainerEstadoContext";
import { useNavigate } from "react-router-dom";
import "./CreateContainerEstado.css";

const CreateContainerEstado = () => {
  const toast = useRef(null);
  const navigate = useNavigate();
  const { createContainerEstado } = useContext(ContainerEstadoContext);

  const validationSchema = Yup.object().shape({
    nombre: Yup.string().required("El nombre es obligatorio"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    await createContainerEstado(values);

    toast.current.show({
      severity: "success",
      summary: "Creado",
      detail: "Estado de container creado correctamente",
      life: 3000,
    });

    resetForm();
    setTimeout(() => navigate("/container"), 1000);
  };

  return (
    <div className="create-container-estado-page">
      <Toast ref={toast} />
      <div className="create-container-estado-container">
        <div className="create-container-estado-card">
          <h2 className="card-title">Crear Estado de Container</h2>

          <Formik
            initialValues={{ nombre: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, values }) => (
              <Form className="create-container-estado-form">
                {/* NOMBRE DEL ESTADO */}
                <div className="form-group">
                  <label htmlFor="nombre">Nombre del Estado</label>
                  <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-tag"></i>
                    </span>
                    <InputText
                      id="nombre"
                      name="nombre"
                      value={values.nombre}
                      onChange={(e) => setFieldValue("nombre", e.target.value)}
                      placeholder="Ej: Disponible"
                      className="create-container-estado-input"
                    />
                  </div>
                  <ErrorMessage
                    name="nombre"
                    component="span"
                    className="error-text"
                  />
                </div>

                {/* BOTÓN */}
                <div className="form-buttons">
                  <Button
                    label="Volver"
                    icon="pi pi-arrow-left"
                    className="p-button-secondary w-48"
                    type="button"
                    onClick={() => navigate("/container")}
                  />
                  
                  <Button
                    type="submit"
                    label="Crear"
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

export default CreateContainerEstado;
