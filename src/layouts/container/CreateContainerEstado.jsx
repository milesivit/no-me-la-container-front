import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRef, useContext } from "react";
import { ContainerEstadoContext } from "../../context/ContainerEstadoContext";
import { useNavigate } from "react-router-dom";

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
    });

    resetForm();
    navigate("/container");
  };

  return (
    <div className="card p-4 max-w-lg mx-auto">
      <Toast ref={toast} />
      <h2 className="text-2xl font-bold mb-4">Crear Estado de Container</h2>

      <Formik
        initialValues={{ nombre: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="p-fluid">
          <div className="mb-3">
            <label>Nombre del Estado</label>
            <Field as={InputText} name="nombre" placeholder="Ej: Disponible" />
            <ErrorMessage
              name="nombre"
              component="small"
              className="p-error"
            />
          </div>

          <Button label="Guardar" icon="pi pi-check" type="submit" />
        </Form>
      </Formik>
    </div>
  );
};

export default CreateContainerEstado;
