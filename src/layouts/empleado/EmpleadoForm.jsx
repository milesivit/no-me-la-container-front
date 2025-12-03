import React, { useRef, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { InputMask } from "primereact/inputmask";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useParams, useNavigate } from "react-router-dom";

import { EmpleadoContext } from "../../context/EmpleadoContext";
import { SexoContext } from "../../context/SexoContext";
import { PaisContext } from "../../context/PaisContext";
import { CargoContext } from "../../context/CargoContext";

import "./EmpleadoForm.css";

const EmpleadoForm = () => {
  const toast = useRef(null);
  const { usuarioId } = useParams();
  const { createEmpleado } = useContext(EmpleadoContext);
  const { sexos } = useContext(SexoContext);
  const { paises } = useContext(PaisContext);
  const { cargos } = useContext(CargoContext);
  const navigate = useNavigate();

  // Validación de formulario
  const validationSchema = Yup.object().shape({
    numeroLegajo: Yup.string().required("El número de legajo es obligatorio"),
    cuil: Yup.string()
      .required("El CUIL es obligatorio")
      .matches(/^\d{2}-\d{8}-\d{1}$/, "Formato de CUIL inválido"),
    dni: Yup.string()
      .required("El DNI es obligatorio")
      .matches(/^\d{7,8}$/, "DNI inválido"),
    direccion: Yup.string().required("La dirección es obligatoria"),
    cbu: Yup.string()
      .required("El CBU es obligatorio")
      .matches(/^\d{22}$/, "CBU inválido"),
    cargoId: Yup.number().required("El cargo es obligatorio"),
    sexoId: Yup.number().required("El sexo es obligatorio"),
    paisId: Yup.number().required("El país es obligatorio"),
    fecha_nacimiento: Yup.date()
    .required("La fecha de nacimiento es obligatoria")
    .max(new Date(), "La fecha no puede ser futura"),

  });

  // Valores iniciales
  const initialValues = {
    numeroLegajo: "",
    cuil: "",
    dni: "",
    direccion: "",
    cbu: "",
    fecha_nacimiento: "",
    licencia: false,
    activo: true,
    cargoId: "",
    sexoId: "",
    paisId: "",
  };

  const onSubmit = async (values, { resetForm }) => {
    let fechaFormateada = null;

    if (values.fecha_nacimiento) {
      fechaFormateada = values.fecha_nacimiento;
    } else {
      toast.current.show({
        severity: "error",
        summary: "Fecha faltante",
        detail: "Debe ingresar la fecha de nacimiento",
        life: 3000,
      });
      return;
    }

    const nuevoEmpleado = {
      ...values,
      fecha_nacimiento: fechaFormateada,
      usuarioId: parseInt(usuarioId),
      dni: values.dni.replace(/\D/g, ""),
      cbu: values.cbu.replace(/\D/g, ""),
      sexoId: parseInt(values.sexoId),
      paisId: parseInt(values.paisId),
      cargoId: parseInt(values.cargoId),
      licencia: values.licencia,
      activo: values.activo,
    };

    console.log("Datos a enviar a la API:", nuevoEmpleado);

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
    <div className="empleado-page">
      <Toast ref={toast} />
      <div className="empleado-container">
        <div className="empleado-card">
          <h2 className="empleado-title">Registrar Empleado</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ values, setFieldValue, touched, errors }) => (
              <Form className="empleado-form">

                {/* Número de legajo */}
                <div className="field">
                  <label>Número de Legajo</label>
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon"><i className="pi pi-id-card"></i></span>
                    <Field as={InputText} name="numeroLegajo" placeholder="Ej: EMP-2025-078" className={errors.numeroLegajo && touched.numeroLegajo ? "p-invalid" : ""} />
                  </div>
                  <ErrorMessage name="numeroLegajo" component="small" className="p-error" />
                </div>

                {/* CUIL */}
                <div className="field">
                  <label>CUIL</label>
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon"><i className="pi pi-credit-card"></i></span>
                    <InputMask
                      mask="99-99999999-9"
                      placeholder="XX-XXXXXXXX-X"
                      value={values.cuil}
                      onChange={(e) => setFieldValue("cuil", e.value)}
                      className={errors.cuil && touched.cuil ? "p-invalid" : ""}
                    />
                  </div>
                  <ErrorMessage name="cuil" component="small" className="p-error" />
                </div>

                {/* DNI */}
                <div className="field">
                  <label>DNI</label>
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon"><i className="pi pi-id-card"></i></span>
                    <InputMask
                      mask="99999999"
                      placeholder="Ej: 40123456"
                      value={values.dni}
                      onChange={(e) => setFieldValue("dni", e.value)}
                      className={errors.dni && touched.dni ? "p-invalid" : ""}
                    />
                  </div>
                  <ErrorMessage name="dni" component="small" className="p-error" />
                </div>
              
                {/* Dirección */}
                <div className="field">
                  <label>Dirección</label>
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon"><i className="pi pi-home"></i></span>
                    <Field as={InputText} name="direccion" placeholder="Ej: San Martín 850, Córdoba Capital" className={errors.direccion && touched.direccion ? "p-invalid" : ""} />
                  </div>
                  <ErrorMessage name="direccion" component="small" className="p-error" />
                </div>

                {/* CBU */}
                <div className="field">
                  <label>CBU</label>
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon"><i className="pi pi-wallet"></i></span>
                    <InputMask
                      mask="9999999999999999999999"
                      placeholder="Ej: 0720588590000005674321"
                      value={values.cbu}
                      onChange={(e) => setFieldValue("cbu", e.value)}
                      className={errors.cbu && touched.cbu ? "p-invalid" : ""}
                    />
                  </div>
                  <ErrorMessage name="cbu" component="small" className="p-error" />
                </div>

                {/* Cargo */}
                <div className="field">
                  <label>Cargo</label>
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon"><i className="pi pi-briefcase"></i></span>
                    <Dropdown
                      value={values.cargoId}
                      options={cargos.map(c => ({ label: c.nombre, value: c.id }))}
                      onChange={(e) => setFieldValue("cargoId", e.value)}
                      placeholder="Seleccione un cargo"
                      className={errors.cargoId && touched.cargoId ? "p-invalid" : ""}
                    />
                  </div>
                  <ErrorMessage name="cargoId" component="small" className="p-error" />
                </div>

                {/* Sexo */}
                <div className="field">
                  <label>Sexo</label>
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon"><i className="pi pi-users"></i></span>
                    <Dropdown
                      value={values.sexoId}
                      options={sexos.map(s => ({ label: s.nombre, value: s.id }))}
                      onChange={(e) => setFieldValue("sexoId", e.value)}
                      placeholder="Seleccione sexo"
                      className={errors.sexoId && touched.sexoId ? "p-invalid" : ""}
                    />
                  </div>
                  <ErrorMessage name="sexoId" component="small" className="p-error" />
                </div>

                {/* País */}
                <div className="field">
                  <label>País</label>
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon"><i className="pi pi-globe"></i></span>
                    <Dropdown
                      value={values.paisId}
                      options={paises.map(p => ({ label: p.nombre, value: p.id }))}
                      onChange={(e) => setFieldValue("paisId", e.value)}
                      placeholder="Seleccione país"
                      className={errors.paisId && touched.paisId ? "p-invalid" : ""}
                    />
                  </div>
                  <ErrorMessage name="paisId" component="small" className="p-error" />
                </div>

                {/* Fecha de nacimiento */}
                <div className="field">
                  <label>Fecha de Nacimiento</label>
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon"><i className="pi pi-calendar"></i></span>
                    <Field
                      as={InputText}
                      type="date"
                      name="fecha_nacimiento"
                      value={values.fecha_nacimiento}
                      onChange={(e) => setFieldValue("fecha_nacimiento", e.target.value)}
                      className={`w-full ${errors.fecha_nacimiento && touched.fecha_nacimiento ? "p-invalid" : ""}`}
                    />
                  </div>
                  <ErrorMessage name="fecha_nacimiento" component="small" className="p-error" />
                </div>

                {/* Licencia */}
                <div className="field-checkbox">
                  <label htmlFor="licencia" className="ml-2">¿Posee licencia?</label>
                  <Checkbox inputId="licencia" checked={values.licencia} onChange={(e) => setFieldValue("licencia", e.checked)} />
                </div>

                {/* Activo */}
                <div className="field-checkbox mb-4">
                  <label htmlFor="activo" className="ml-2">Activo</label>
                  <Checkbox inputId="activo" checked={values.activo} onChange={(e) => setFieldValue("activo", e.checked)} />
                </div>

                <Button type="submit" label="Guardar Empleado" className="btnGuardarEmpleado" />

              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default EmpleadoForm;
