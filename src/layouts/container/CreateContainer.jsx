import { useEffect, useRef, useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreateContainer.css";

const CreateContainer = () => {
  const toast = useRef(null);
  const [estados, setEstados] = useState([]);
  const navigate = useNavigate();

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

  // Validación Yup
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
      // Convertir capacidad_max a número
      const payload = {
        ...values,
        capacidad_max: Number(values.capacidad_max),
      };

      await axios.post("http://localhost:3000/container", payload);

      toast.current.show({
        severity: "success",
        summary: "Creado",
        detail: "Container creado correctamente",
        life: 3000,
      });

      resetForm();
      setTimeout(() => navigate("/container"), 1000);
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail:
          error.response?.data?.message || "No se pudo crear el container",
        life: 3000,
      });
    }
  };

  return (
    <div className="create-container-page">
      <Toast ref={toast} />
      <div className="create-container-container">
        <div className="create-container-card">
          <h2 className="card-title">Crear Container</h2>

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
              <Form className="create-container-form">
                {/* CÓDIGO */}
                <div className="form-group">
                  <label htmlFor="codigo">Código</label>
                  <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-barcode"></i>
                    </span>
                    <InputText
                      id="codigo"
                      name="codigo"
                      value={values.codigo}
                      onChange={(e) => setFieldValue("codigo", e.target.value)}
                      placeholder="Ingrese un código"
                    />
                  </div>
                  <ErrorMessage name="codigo" component="span" className="error-text" />
                </div>

                {/* CAPACIDAD MÁX */}
                <div className="form-group">
                  <label htmlFor="capacidad_max">Capacidad Máxima</label>
                  <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-database"></i>
                    </span>
                    <InputText
                      id="capacidad_max"
                      name="capacidad_max"
                      value={values.capacidad_max}
                      onChange={(e) => setFieldValue("capacidad_max", e.target.value)}
                      placeholder="Ingrese la capacidad"
                      keyfilter="num"
                    />
                  </div>
                  <ErrorMessage
                    name="capacidad_max"
                    component="span"
                    className="error-text"
                  />
                </div>

                {/* ESTADO */}
                <div className="form-group">
                  <label htmlFor="container_estado_id">Estado</label>
                  <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-list"></i>
                    </span>
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
                  </div>
                  <ErrorMessage
                    name="container_estado_id"
                    component="span"
                    className="error-text"
                  />
                </div>

                {/* BOTONES */}
                <div className="form-buttons flex gap-2 mt-4">
                  <Button
                    label="Volver"
                    icon="pi pi-arrow-left"
                    className="p-button-secondary w-48"
                    type="button"
                    onClick={() => navigate("/container")}
                  />
                  <Button
                    type="submit"
                    label="Crear Container"
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

export default CreateContainer;
