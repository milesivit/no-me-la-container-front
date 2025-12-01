import { useContext, useRef } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";

import { CargaContainerContext } from "../../context/CargaContainerContext";
import { ContainerContext } from "../../context/ContainerContext";
import { CategoriaCargaContext } from "../../context/CategoriaCargaContext";

import { useNavigate } from "react-router-dom";
import "./CreateCargaContainer.css";

const CreateCargaContainer = () => {
  const { createCargaContainer } = useContext(CargaContainerContext);
  const { containers } = useContext(ContainerContext);
  const { categoriacargas } = useContext(CategoriaCargaContext);

  const toast = useRef(null);
  const navigate = useNavigate();

  const initialValues = {
    container_id: "",
    descripcion: "",
    cantidad: "",
    peso: "",
    categoria_carga_id: "",
    observaciones: "",
  };

  const validationSchema = Yup.object({
    container_id: Yup.number().required("Campo requerido"),
    descripcion: Yup.string().required("Campo requerido"),
    cantidad: Yup.number().typeError("Debe ser número").min(1).required("Campo requerido"),
    peso: Yup.number().typeError("Debe ser número").min(0.1).required("Campo requerido"),
    categoria_carga_id: Yup.number().required("Campo requerido"),
  });

  const onSubmit = async (values, { resetForm }) => {
    try {
      const newCarga = await createCargaContainer(values);

      if (!newCarga || !newCarga.id) {
        throw new Error("Respuesta inválida");
      }

      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Carga registrada correctamente",
        life: 2000,
      });

      resetForm();

      setTimeout(() => {
        navigate(`/asignar-viaje/${newCarga.id}`, {
          state: { containerId: newCarga.container_id },
        });
      }, 200);
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo crear la carga",
        life: 3000,
      });
    }
  };

  return (
    <div className="create-carga-page">
      <Toast ref={toast} />

      <div className="create-carga-container">
        <h1 className="carga-title">Registrar Carga para Container</h1>

        <div className="create-carga-card">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ handleChange, setFieldValue, values }) => (
              <Form className="create-carga-form">
                
                <div className="form-group">
                  <label htmlFor="container_id">Container</label>
                  <Dropdown
                    id="container_id"
                    name="container_id"
                    value={values.container_id}
                    options={containers.map((c) => ({ label: c.codigo, value: c.id }))}
                    onChange={(e) => setFieldValue("container_id", e.value)}
                    placeholder="Seleccione un container"
                    className="w-full container-input"
                  />
                  <ErrorMessage name="container_id" component="span" className="error-text" />
                </div>

                <div className="form-group">
                  <label htmlFor="categoria_carga_id">Categoría de Carga</label>
                  <Dropdown
                    id="categoria_carga_id"
                    name="categoria_carga_id"
                    value={values.categoria_carga_id}
                    options={categoriacargas.map((cat) => ({ label: cat.nombre, value: cat.id }))}
                    onChange={(e) => setFieldValue("categoria_carga_id", e.value)}
                    placeholder="Seleccione categoría"
                    className="w-full container-input"
                  />
                  <ErrorMessage name="categoria_carga_id" component="span" className="error-text" />
                </div>

                <div className="form-group">
                  <label htmlFor="descripcion">Descripción</label>
                  <InputText
                    id="descripcion"
                    name="descripcion"
                    value={values.descripcion}
                    onChange={handleChange}
                    placeholder="Descripción de la carga"
                    className="w-full container-input"
                  />
                  <ErrorMessage name="descripcion" component="span" className="error-text" />
                </div>

                <div className="form-group inputnumber-stacked">
                  <label htmlFor="cantidad">Cantidad</label>
                  <InputNumber
                    id="cantidad"
                    name="cantidad"
                    value={values.cantidad}
                    onValueChange={(e) => setFieldValue("cantidad", e.value)}
                    placeholder="Ingrese cantidad"
                    className="w-full container-input"
                    keyfilter="int"
                    min={1}
                    showButtons
                    incrementButtonIcon="pi pi-chevron-up"
                    decrementButtonIcon="pi pi-chevron-down"
                  />
                  <ErrorMessage name="cantidad" component="span" className="error-text" />
                </div>

                <div className="form-group inputnumber-stacked">
                  <label htmlFor="peso">Peso (kg)</label>
                  <InputNumber
                    id="peso"
                    name="peso"
                    value={values.peso}
                    onValueChange={(e) => setFieldValue("peso", e.value)}
                    placeholder="Peso total"
                    className="w-full container-input"
                    keyfilter="int"
                    min={1}
                    showButtons
                    incrementButtonIcon="pi pi-chevron-up"
                    decrementButtonIcon="pi pi-chevron-down"
                    minFractionDigits={2}
                  />
                  <ErrorMessage name="peso" component="span" className="error-text" />
                </div>

                <div className="form-group">
                  <label htmlFor="observaciones">Observaciones</label>
                  <InputText
                    id="observaciones"
                    name="observaciones"
                    value={values.observaciones}
                    onChange={handleChange}
                    placeholder="Notas adicionales"
                    className="w-full container-input"
                  />
                </div>

                <div className="form-buttons">
                  <Button
                    label="Volver"
                    icon="pi pi-arrow-left"
                    className="p-button-secondary w-48"
                    type="button"
                    onClick={() => navigate("/")}
                  />

                  <Button
                    type="submit"
                    label="Siguiente"
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

export default CreateCargaContainer;
