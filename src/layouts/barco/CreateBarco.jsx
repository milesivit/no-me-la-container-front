import { useContext, useRef } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { BarcoContext } from "../../context/BarcoContext";
import { useNavigate } from "react-router-dom";
import "./CreateBarco.css";

const CreateBarco = () => {
  const { createBarco } = useContext(BarcoContext);
  const toast = useRef(null);
  const navigate = useNavigate();

  const initialValues = {
    nombre: "",
    nroMatricula: "",
    nroRegistro: "",
    modelo: "",
    constructura: "",
    capacidadMaxContainer: "",
  };

  const validationSchema = Yup.object({
    nombre: Yup.string().required("Campo requerido"),
    nroMatricula: Yup.string().required("Campo requerido"),
    nroRegistro: Yup.string().required("Campo requerido"),
    modelo: Yup.string().required("Campo requerido"),
    constructura: Yup.string().required("Campo requerido"),
    capacidadMaxContainer: Yup.number()
      .typeError("Debe ser un número")
      .min(1, "Debe ser mayor que 0")
      .required("Campo requerido"),
  });

  const onSubmit = async (values, { resetForm }) => {
    console.log("Formulario enviado con valores:", values);
    try {
      await createBarco(values);
      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Barco creado correctamente",
        life: 3000,
      });
      resetForm();
      setTimeout(() => navigate("/flota"), 1000);
    } catch (error) {
      console.error("Error al crear barco:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo crear el barco",
        life: 3000,
      });
    }
  };

  return (
    <div className="create-barco-page">
      <Toast ref={toast} />
      <div className="create-barco-container">
        <Card title="Registrar Barco" className="create-barco-card">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ handleChange, values }) => (
              <Form className="create-barco-form">
                
                {/* Nombre */}
                <div className="form-group">
                  <label htmlFor="nombre">Nombre</label>
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-user"></i>
                    </span>
                    <InputText
                      id="nombre"
                      name="nombre"
                      value={values.nombre}
                      onChange={handleChange}
                      placeholder="Ingrese el nombre"
                      className="create-barco-input"
                    />
                  </div>
                  <ErrorMessage name="nombre" component="span" className="error-text" />
                </div>

                {/* Matrícula */}
                <div className="form-group">
                  <label htmlFor="nroMatricula">Matrícula</label>
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-id-card"></i>
                    </span>
                    <InputText
                      id="nroMatricula"
                      name="nroMatricula"
                      value={values.nroMatricula}
                      onChange={handleChange}
                      placeholder="Ingrese la matrícula"
                      className="create-barco-input"
                    />
                  </div>
                  <ErrorMessage name="nroMatricula" component="span" className="error-text" />
                </div>

                {/* Registro */}
                <div className="form-group">
                  <label htmlFor="nroRegistro">Registro</label>
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-file"></i>
                    </span>
                    <InputText
                      id="nroRegistro"
                      name="nroRegistro"
                      value={values.nroRegistro}
                      onChange={handleChange}
                      placeholder="Ingrese el registro"
                      className="create-barco-input"
                    />
                  </div>
                  <ErrorMessage name="nroRegistro" component="span" className="error-text" />
                </div>

                {/* Modelo */}
                <div className="form-group">
                  <label htmlFor="modelo">Modelo</label>
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-cog"></i>
                    </span>
                    <InputText
                      id="modelo"
                      name="modelo"
                      value={values.modelo}
                      onChange={handleChange}
                      placeholder="Ingrese el modelo"
                      className="create-barco-input"
                    />
                  </div>
                  <ErrorMessage name="modelo" component="span" className="error-text" />
                </div>

                {/* Constructora */}
                <div className="form-group">
                  <label htmlFor="constructura">Constructora</label>
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-building"></i>
                    </span>
                    <InputText
                      id="constructura"
                      name="constructura"
                      value={values.constructura}
                      onChange={handleChange}
                      placeholder="Ingrese la constructora"
                      className="create-barco-input"
                    />
                  </div>
                  <ErrorMessage name="constructura" component="span" className="error-text" />
                </div>

                {/* Capacidad Máxima */}
                <div className="form-group">
                  <label htmlFor="capacidadMaxContainer">Capacidad Máxima (containers)</label>
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-box"></i>
                    </span>
                    <InputText
                      id="capacidadMaxContainer"
                      name="capacidadMaxContainer"
                      value={values.capacidadMaxContainer}
                      onChange={handleChange}
                      placeholder="Ingrese la capacidad"
                      className="create-barco-input"
                      keyfilter="int"
                    />
                  </div>
                  <ErrorMessage
                    name="capacidadMaxContainer"
                    component="span"
                    className="error-text"
                  />
                </div>

                {/* Botones */}
                <div className="form-buttons">
                  <Button
                    label="Volver"
                    icon="pi pi-arrow-left"
                    className="p-button-secondary w-48"
                    type="button"
                    onClick={() => navigate("/flota")}
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

export default CreateBarco;
