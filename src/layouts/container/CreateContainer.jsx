import { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import axios from "axios";

const CreateContainer = () => {
  const toast = useRef(null);
  const [estados, setEstados] = useState([]);

  // Cargar estados desde la API
  const fetchEstados = async () => {
    try {
      const res = await axios.get("http://localhost:3000/containerestado");
      setEstados(res.data.data || res.data); 
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar los estados",
      });
    }
  };

  useEffect(() => {
    fetchEstados();
  }, []);

  // Validación Yup igual a CreateBarco
  const validationSchema = Yup.object().shape({
    codigo: Yup.string().required("El código es obligatorio"),
    capacidad_max: Yup.number()
      .typeError("Debe ser un número")
      .required("La capacidad es obligatoria")
      .positive("Debe ser mayor que 0"),
    container_estado_id: Yup.number()
      .required("El estado es obligatorio")
      .typeError("Seleccione un estado"),
  });

  // Enviar formulario
  const handleSubmit = async (values, { resetForm }) => {
    try {
      await axios.post("http://localhost:3000/containers", values);

      toast.current.show({
        severity: "success",
        summary: "Creado",
        detail: "Container creado correctamente",
      });

      resetForm();
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail:
          error.response?.data?.message || "No se pudo crear el container",
      });
    }
  };

  return (
    <div className="card p-4 max-w-xl mx-auto">
      <Toast ref={toast} />

      <h2 className="text-2xl font-bold mb-4">Crear Container</h2>

      <Formik
        initialValues={{
          codigo: "",
          capacidad_max: "",
          container_estado_id: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values }) => (
          <Form className="p-fluid">
            {/* CÓDIGO */}
            <div className="mb-3">
              <label>Código</label>
              <Field
                name="codigo"
                as={InputText}
                placeholder="Ej: CNT-001"
              />
              <ErrorMessage
                name="codigo"
                component="small"
                className="p-error"
              />
            </div>

            {/* CAPACIDAD MAX */}
            <div className="mb-3">
              <label>Capacidad Máxima</label>
              <InputNumber
                value={values.capacidad_max}
                onValueChange={(e) =>
                  setFieldValue("capacidad_max", e.value)
                }
                placeholder="Ej: 20000"
                mode="decimal"
              />
              <ErrorMessage
                name="capacidad_max"
                component="small"
                className="p-error"
              />
            </div>

            {/* ESTADO */}
            <div className="mb-3">
              <label>Estado</label>
              <Dropdown
                value={values.container_estado_id}
                options={estados || []} 
                optionLabel="nombre"
                optionValue="id"
                placeholder="Seleccione un estado"
                onChange={(e) =>
                  setFieldValue("container_estado_id", e.value)
                }
              />
              <ErrorMessage
                name="container_estado_id"
                component="small"
                className="p-error"
              />
            </div>

            {/* BOTÓN */}
            <Button type="submit" label="Crear Container" />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateContainer;
