import React, { useRef, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import Navbar from "../components/Navbar";
import { useParams, useNavigate } from "react-router-dom";

import { EmpleadoContext } from "../../context/EmpleadoContext";
import { SexoContext } from "../../context/SexoContext";
import { PaisContext } from "../../context/PaisContext";
import { CargoContext } from "../../context/CargoContext";

const EmpleadoForm = () => {
  const toast = useRef(null);
  const { usuarioId } = useParams();
  const { createEmpleado } = useContext(EmpleadoContext);
  const { sexos } = useContext(SexoContext);
  const { paises } = useContext(PaisContext);
  const { cargos } = useContext(CargoContext);
  const navigate = useNavigate();

  //esquema de validacion
  const validationSchema = Yup.object().shape({
    numeroLegajo: Yup.string().required("El número de legajo es obligatorio"),
    cuil: Yup.string().required("El CUIL es obligatorio"),
    dni: Yup.string().required("El DNI es obligatorio"),
    direccion: Yup.string().required("La dirección es obligatoria"),
    cbu: Yup.string().required("El CBU es obligatorio"),
    cargoId: Yup.number().required("El cargo es obligatorio"),
    sexoId: Yup.number().required("El sexo es obligatorio"),
    paisId: Yup.number().required("El país es obligatorio"),
    fecha_nacimiento: Yup.date().required("La fecha de nacimiento es obligatoria"),
  });

  //valores iniciales
  const initialValues = {
    numeroLegajo: "",
    cuil: "",
    dni: "",
    direccion: "",
    cbu: "",
    fecha_nacimiento: null,
    licencia: false,
    activo: true,
    cargoId: "",
    sexoId: "",
    paisId: "",
  };

  //envio del formulario
  const onSubmit = async (values, { resetForm }) => {
    const nuevoEmpleado = {
      ...values,
      usuarioId: parseInt(usuarioId),
    };

    try {
      await createEmpleado(nuevoEmpleado);
      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Empleado creado correctamente",
        life: 3000,
      });
      resetForm();
      navigate("/");
    } catch (error) {
      console.error("Error al crear empleado:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo crear el empleado",
        life: 3000,
      });
    }
  };

  return (
    <div className="flex justify-content-center align-items-center h-screen bg-gray-100">
      <Navbar />
      <Toast ref={toast} />
      <div className="surface-card p-4 shadow-2 border-round w-full md:w-6 lg:w-4">
        <h2 className="text-center text-primary mb-4">Registrar Empleado</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ values, setFieldValue, errors, touched }) => (
            <Form className="p-fluid">
              {/* Número de legajo */}
              <div className="field mb-3">
                <label htmlFor="numeroLegajo" className="block font-medium mb-2">
                  Número de Legajo
                </label>
                <Field
                  as={InputText}
                  id="numeroLegajo"
                  name="numeroLegajo"
                  placeholder="Ej: EMP001"
                  className={errors.numeroLegajo && touched.numeroLegajo ? "p-invalid" : ""}
                />
                <ErrorMessage name="numeroLegajo" component="small" className="p-error block mt-1" />
              </div>

              {/* CUIL */}
              <div className="field mb-3">
                <label htmlFor="cuil" className="block font-medium mb-2">
                  CUIL
                </label>
                <Field
                  as={InputText}
                  id="cuil"
                  name="cuil"
                  placeholder="Ej: 20-12345678-9"
                  className={errors.cuil && touched.cuil ? "p-invalid" : ""}
                />
                <ErrorMessage name="cuil" component="small" className="p-error block mt-1" />
              </div>

              {/* DNI */}
              <div className="field mb-3">
                <label htmlFor="dni" className="block font-medium mb-2">
                  DNI
                </label>
                <Field
                  as={InputText}
                  id="dni"
                  name="dni"
                  placeholder="Ej: 40123456"
                  className={errors.dni && touched.dni ? "p-invalid" : ""}
                />
                <ErrorMessage name="dni" component="small" className="p-error block mt-1" />
              </div>

              {/* direccion */}
              <div className="field mb-3">
                <label htmlFor="direccion" className="block font-medium mb-2">
                  Dirección
                </label>
                <Field
                  as={InputText}
                  id="direccion"
                  name="direccion"
                  placeholder="Ej: Av. Belgrano 123"
                  className={errors.direccion && touched.direccion ? "p-invalid" : ""}
                />
                <ErrorMessage name="direccion" component="small" className="p-error block mt-1" />
              </div>

              {/* CBU */}
              <div className="field mb-3">
                <label htmlFor="cbu" className="block font-medium mb-2">
                  CBU
                </label>
                <Field
                  as={InputText}
                  id="cbu"
                  name="cbu"
                  placeholder="Ej: 0170001230000000001234"
                  className={errors.cbu && touched.cbu ? "p-invalid" : ""}
                />
                <ErrorMessage name="cbu" component="small" className="p-error block mt-1" />
              </div>

              {/* Cargo */}
              <div className="field mb-3">
                <label htmlFor="cargoId" className="block font-medium mb-2">
                  Cargo
                </label>
                <Dropdown
                  id="cargoId"
                  value={values.cargoId}
                  options={cargos.map((c) => ({ label: c.nombre, value: c.id }))}
                  onChange={(e) => setFieldValue("cargoId", e.value)}
                  placeholder="Seleccione un cargo"
                  className={errors.cargoId && touched.cargoId ? "p-invalid" : ""}
                />
                <ErrorMessage name="cargoId" component="small" className="p-error block mt-1" />
              </div>

              {/* Sexo */}
              <div className="field mb-3">
                <label htmlFor="sexoId" className="block font-medium mb-2">
                  Sexo
                </label>
                <Dropdown
                  id="sexoId"
                  value={values.sexoId}
                  options={sexos.map((s) => ({ label: s.nombre, value: s.id }))}
                  onChange={(e) => setFieldValue("sexoId", e.value)}
                  placeholder="Seleccione el sexo"
                  className={errors.sexoId && touched.sexoId ? "p-invalid" : ""}
                />
                <ErrorMessage name="sexoId" component="small" className="p-error block mt-1" />
              </div>

              {/* País */}
              <div className="field mb-3">
                <label htmlFor="paisId" className="block font-medium mb-2">
                  País
                </label>
                <Dropdown
                  id="paisId"
                  value={values.paisId}
                  options={paises.map((p) => ({ label: p.nombre, value: p.id }))}
                  onChange={(e) => setFieldValue("paisId", e.value)}
                  placeholder="Seleccione un país"
                  className={errors.paisId && touched.paisId ? "p-invalid" : ""}
                />
                <ErrorMessage name="paisId" component="small" className="p-error block mt-1" />
              </div>

              {/* Fecha de nacimiento */}
              <div className="field mb-3">
                <label htmlFor="fecha_nacimiento" className="block font-medium mb-2">
                  Fecha de Nacimiento
                </label>
                <Calendar
                  id="fecha_nacimiento"
                  value={values.fecha_nacimiento}
                  onChange={(e) => setFieldValue("fecha_nacimiento", e.value)}
                  dateFormat="yy-mm-dd"
                  showIcon
                  className={errors.fecha_nacimiento && touched.fecha_nacimiento ? "p-invalid" : ""}
                />
                <ErrorMessage name="fecha_nacimiento" component="small" className="p-error block mt-1" />
              </div>

              {/* Licencia */}
              <div className="field-checkbox mb-3">
                <Checkbox
                  inputId="licencia"
                  checked={values.licencia}
                  onChange={(e) => setFieldValue("licencia", e.checked)}
                />
                <label htmlFor="licencia" className="ml-2">
                  ¿Posee licencia?
                </label>
              </div>

              {/* Activo */}
              <div className="field-checkbox mb-4">
                <Checkbox
                  inputId="activo"
                  checked={values.activo}
                  onChange={(e) => setFieldValue("activo", e.checked)}
                />
                <label htmlFor="activo" className="ml-2">
                  Activo
                </label>
              </div>

              <Button type="submit" label="Guardar Empleado" className="w-full" />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EmpleadoForm;
