import { useContext, useRef } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import Navbar from "../components/Navbar";
import { BarcoContext } from "../../context/BarcoContext";
import { useNavigate } from "react-router-dom";

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
    try {
      await createBarco(values);
      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Barco creado correctamente",
        life: 3000,
      });
      resetForm();

      setTimeout(() => {
        navigate("/flota"); 
      }, 1000);
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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <Toast ref={toast} />
      <div className="flex justify-center items-center flex-1 p-6">
        <Card title="Registrar Barco" className="shadow-lg w-full max-w-lg">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ handleChange, values }) => (
              <Form className="flex flex-col gap-4">
                {/* Nombre */}
                <div>
                  <label htmlFor="nombre" className="block mb-1 font-semibold">
                    Nombre
                  </label>
                  <InputText
                    id="nombre"
                    name="nombre"
                    value={values.nombre}
                    onChange={handleChange}
                    className="w-full"
                  />
                  <ErrorMessage
                    name="nombre"
                    component="small"
                    className="p-error block"
                  />
                </div>

                {/* Matrícula */}
                <div>
                  <label htmlFor="nroMatricula" className="block mb-1 font-semibold">
                    Matrícula
                  </label>
                  <InputText
                    id="nroMatricula"
                    name="nroMatricula"
                    value={values.nroMatricula}
                    onChange={handleChange}
                    className="w-full"
                  />
                  <ErrorMessage
                    name="nroMatricula"
                    component="small"
                    className="p-error block"
                  />
                </div>

                {/* Registro */}
                <div>
                  <label htmlFor="nroRegistro" className="block mb-1 font-semibold">
                    Registro
                  </label>
                  <InputText
                    id="nroRegistro"
                    name="nroRegistro"
                    value={values.nroRegistro}
                    onChange={handleChange}
                    className="w-full"
                  />
                  <ErrorMessage
                    name="nroRegistro"
                    component="small"
                    className="p-error block"
                  />
                </div>

                {/* Modelo */}
                <div>
                  <label htmlFor="modelo" className="block mb-1 font-semibold">
                    Modelo
                  </label>
                  <InputText
                    id="modelo"
                    name="modelo"
                    value={values.modelo}
                    onChange={handleChange}
                    className="w-full"
                  />
                  <ErrorMessage
                    name="modelo"
                    component="small"
                    className="p-error block"
                  />
                </div>

                {/* Constructora */}
                <div>
                  <label htmlFor="constructura" className="block mb-1 font-semibold">
                    Constructora
                  </label>
                  <InputText
                    id="constructura"
                    name="constructura"
                    value={values.constructura}
                    onChange={handleChange}
                    className="w-full"
                  />
                  <ErrorMessage
                    name="constructura"
                    component="small"
                    className="p-error block"
                  />
                </div>

                {/* Capacidad */}
                <div>
                  <label
                    htmlFor="capacidadMaxContainer"
                    className="block mb-1 font-semibold"
                  >
                    Capacidad Máxima (containers)
                  </label>
                  <InputText
                    id="capacidadMaxContainer"
                    name="capacidadMaxContainer"
                    value={values.capacidadMaxContainer}
                    onChange={handleChange}
                    className="w-full"
                  />
                  <ErrorMessage
                    name="capacidadMaxContainer"
                    component="small"
                    className="p-error block"
                  />
                </div>

                {/* Botones */}
                <div className="flex justify-between mt-4">
                  <Button
                    label="Volver"
                    icon="pi pi-arrow-left"
                    className="p-button-text"
                    type="button"
                    onClick={() => navigate("/flota")}
                  />
                  <Button type="submit" label="Guardar" icon="pi pi-check" />
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
