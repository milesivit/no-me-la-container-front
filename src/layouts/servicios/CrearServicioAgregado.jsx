import { useContext, useRef } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { ServicioAgregadoContext } from "../../context/ServicioAgregadoContext";
import { useNavigate } from "react-router-dom";

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

      setTimeout(() => {
        navigate("/servicio");
      }, 1000);
    } catch (error) {
      console.error("Error al crear servicio:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo crear el servicio agregado",
        life: 3000,
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Toast ref={toast} />

      <div className="flex justify-center items-center flex-1 p-6">
        <Card title="Registrar Servicio Agregado" className="shadow-lg w-full max-w-lg">
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

                {/* Código */}
                <div>
                  <label htmlFor="codServicio" className="block mb-1 font-semibold">
                    Código
                  </label>
                  <InputText
                    id="codServicio"
                    name="codServicio"
                    value={values.codServicio}
                    onChange={handleChange}
                    className="w-full"
                  />
                  <ErrorMessage
                    name="codServicio"
                    component="small"
                    className="p-error block"
                  />
                </div>

                {/* Coste */}
                <div>
                  <label htmlFor="coste" className="block mb-1 font-semibold">
                    Coste
                  </label>
                  <InputText
                    id="coste"
                    name="coste"
                    value={values.coste}
                    onChange={handleChange}
                    className="w-full"
                  />
                  <ErrorMessage
                    name="coste"
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
                    onClick={() => navigate("/servicio")}
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

export default CrearServicioAgregado;
