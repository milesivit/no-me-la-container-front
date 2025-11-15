import React, { useRef, useContext, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { InputMask } from 'primereact/inputmask';
import { useParams, useNavigate } from "react-router-dom";

import { ClienteContext } from "../../context/ClienteContext";
import { SexoContext } from "../../context/SexoContext";
import { PaisContext } from "../../context/PaisContext";
import { CondicionFiscalContext } from "../../context/CondicionFiscalContext";
import { RazonSocialContext } from "../../context/RazonSocialContext";

import "./ClienteForm.css"; 
import 'primeicons/primeicons.css';

const ClienteForm = () => {
  const toast = useRef(null);
  const { usuarioId } = useParams();
  const { createCliente } = useContext(ClienteContext);
  const { sexos, fetchSexos } = useContext(SexoContext);
  const { paises, fetchPaises } = useContext(PaisContext);
  const { condicionesFiscales, fetchCondicionesFiscales } = useContext(CondicionFiscalContext);
  const { razonesSociales, fetchRazonesSociales } = useContext(RazonSocialContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSexos();
    fetchPaises();
    fetchCondicionesFiscales();
    fetchRazonesSociales();
  }, []);

  const validationSchema = Yup.object().shape({
    nombre: Yup.string().required("El nombre es obligatorio"),
    apellido: Yup.string().required("El apellido es obligatorio"),
    telefono: Yup.string().required("El teléfono es obligatorio"),
    direccion: Yup.string().required("La dirección es obligatoria"),
    dni: Yup.string().required("El DNI es obligatorio"),
    cuil: Yup.string().required("El CUIL es obligatorio"),
    sexoId: Yup.number().required("Seleccione un sexo"),
    paisId: Yup.number().required("Seleccione un país"),
    razonSocialId: Yup.number().required("Seleccione una razón social"),
    condicionFiscalId: Yup.number().required("Seleccione una condición fiscal"),
    fecha_nacimiento: Yup.string().required("La fecha de nacimiento es obligatoria"),
  });

  const initialValues = {
    nombre: "",
    apellido: "",
    telefono: "",
    direccion: "",
    dni: "",
    cuil: "",
    sexoId: "",
    paisId: "",
    razonSocialId: "",
    condicionFiscalId: "",
    fecha_nacimiento: "",
    observacion: "",
  };

  const onSubmit = async (values, { resetForm }) => {
    // ----------- VALIDACIÓN Y FORMATEO DE FECHA -----------
    let fechaFormateada = null;
    if (values.fecha_nacimiento) {
      const [dd, mm, yyyy] = values.fecha_nacimiento.split("/");
      const dateObj = new Date(`${yyyy}-${mm}-${dd}`);

      if (
        !isNaN(dateObj.getTime()) &&
        dateObj.getFullYear() === parseInt(yyyy) &&
        dateObj.getMonth() + 1 === parseInt(mm) &&
        dateObj.getDate() === parseInt(dd)
      ) {
        fechaFormateada = `${yyyy}-${mm}-${dd}`;
      } else {
        toast.current.show({
          severity: "error",
          summary: "Fecha inválida",
          detail: "La fecha de nacimiento ingresada no es válida",
          life: 3000,
        });
        return; // detenemos submit
      }
    } else {
      toast.current.show({
        severity: "error",
        summary: "Fecha faltante",
        detail: "Debe ingresar la fecha de nacimiento",
        life: 3000,
      });
      return;
    }

    const nuevoCliente = {
      ...values,
      usuarioId: parseInt(usuarioId),
      sexoId: parseInt(values.sexoId),
      paisId: parseInt(values.paisId),
      razonSocialId: parseInt(values.razonSocialId),
      condicionFiscalId: parseInt(values.condicionFiscalId),
      telefono: values.telefono.replace(/\D/g, ""),
      dni: values.dni.replace(/\D/g, ""),
      cuil: values.cuil,
      fecha_nacimiento: fechaFormateada,
      activo: true,
    };

    console.log("Cliente formateado a enviar:", nuevoCliente);

    try {
      await createCliente(nuevoCliente);
      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Cliente creado correctamente",
        life: 3000,
      });
      resetForm();
      navigate("/");
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo crear el cliente",
        life: 3000,
      });
    }
  };

  return (
    <div className="cliente-page">
      <Toast ref={toast} />
      <div className="cliente-container">
        <Card title="Completar Datos del Cliente" className="cliente-card">
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ errors, touched, setFieldValue, setFieldTouched, values }) => (
              <Form className="flex flex-col gap-4 cliente-form">

                {/* Nombre y Apellido */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nombre">Nombre</label>
                    <div className="p-inputgroup">
                      <span className="p-inputgroup-addon"><i className="pi pi-user"></i></span>
                      <Field
                        as={InputText}
                        id="nombre"
                        name="nombre"
                        placeholder="Ingrese el nombre"
                        className={`w-full ${errors.nombre && touched.nombre ? "p-invalid" : ""}`}
                      />
                    </div>
                    <ErrorMessage name="nombre" component="small" className="p-error" />
                  </div>
                  <div>
                    <label htmlFor="apellido">Apellido</label>
                    <div className="p-inputgroup">
                      <span className="p-inputgroup-addon"><i className="pi pi-user"></i></span>
                      <Field
                        as={InputText}
                        id="apellido"
                        name="apellido"
                        placeholder="Ingrese el apellido"
                        className={`w-full ${errors.apellido && touched.apellido ? "p-invalid" : ""}`}
                      />
                    </div>
                    <ErrorMessage name="apellido" component="small" className="p-error" />
                  </div>
                </div>

                {/* DNI y CUIL */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label>DNI</label>
                    <div className="p-inputgroup">
                      <span className="p-inputgroup-addon"><i className="pi pi-id-card"></i></span>
                      <InputMask
                        mask="99999999"
                        placeholder="Ingrese DNI"
                        value={values.dni}
                        onChange={(e) => setFieldValue("dni", e.value)}
                        onBlur={() => setFieldTouched("dni", true)}
                        className={`w-full ${errors.dni && touched.dni ? "p-invalid" : ""}`}
                      />
                    </div>
                    <ErrorMessage name="dni" component="small" className="p-error" />
                  </div>
                  <div>
                    <label>CUIL</label>
                    <div className="p-inputgroup">
                      <span className="p-inputgroup-addon"><i className="pi pi-credit-card"></i></span>
                      <InputMask
                        mask="99-99999999-9"
                        placeholder="Ingrese CUIL"
                        value={values.cuil}
                        onChange={(e) => setFieldValue("cuil", e.value)}
                        onBlur={() => setFieldTouched("cuil", true)}
                        className={`w-full ${errors.cuil && touched.cuil ? "p-invalid" : ""}`}
                      />
                    </div>
                    <ErrorMessage name="cuil" component="small" className="p-error" />
                  </div>
                </div>

                {/* Teléfono y Dirección */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label>Teléfono</label>
                    <div className="p-inputgroup">
                      <span className="p-inputgroup-addon"><i className="pi pi-phone"></i></span>
                      <InputMask
                        mask="(999) 999-9999"
                        placeholder="Ingrese teléfono"
                        value={values.telefono}
                        onChange={(e) => setFieldValue("telefono", e.value)}
                        onBlur={() => setFieldTouched("telefono", true)}
                        className={`w-full ${errors.telefono && touched.telefono ? "p-invalid" : ""}`}
                      />
                    </div>
                    <ErrorMessage name="telefono" component="small" className="p-error" />
                  </div>
                  <div>
                    <label>Dirección</label>
                    <div className="p-inputgroup">
                      <span className="p-inputgroup-addon"><i className="pi pi-home"></i></span>
                      <Field
                        as={InputText}
                        name="direccion"
                        placeholder="Ingrese dirección"
                        className={`w-full ${errors.direccion && touched.direccion ? "p-invalid" : ""}`}
                      />
                    </div>
                    <ErrorMessage name="direccion" component="small" className="p-error" />
                  </div>
                </div>

                {/* Fecha de nacimiento */}
                <div>
                  <label>Fecha de nacimiento</label>
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon"><i className="pi pi-calendar"></i></span>
                    <InputMask
                      mask="99/99/9999"
                      placeholder="dd/mm/yyyy"
                      value={values.fecha_nacimiento}
                      onChange={(e) => setFieldValue("fecha_nacimiento", e.value)}
                      onBlur={() => setFieldTouched("fecha_nacimiento", true)}
                      className={`w-full ${errors.fecha_nacimiento && touched.fecha_nacimiento ? "p-invalid" : ""}`}
                    />
                  </div>
                  <ErrorMessage name="fecha_nacimiento" component="small" className="p-error" />
                </div>

                {/* Sexo y País */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label>Sexo</label>
                    <div className="p-inputgroup">
                      <span className="p-inputgroup-addon"><i className="pi pi-users"></i></span>
                      <Dropdown
                        value={values.sexoId}
                        options={sexos.map((s) => ({ label: s.nombre, value: s.id }))}
                        onChange={(e) => setFieldValue("sexoId", e.value)}
                        placeholder="Seleccione sexo"
                        className={`w-full ${errors.sexoId && touched.sexoId ? "p-invalid" : ""}`}
                      />
                    </div>
                    <ErrorMessage name="sexoId" component="small" className="p-error" />
                  </div>
                  <div>
                    <label>País</label>
                    <div className="p-inputgroup">
                      <span className="p-inputgroup-addon"><i className="pi pi-globe"></i></span>
                      <Dropdown
                        value={values.paisId}
                        options={paises.map((p) => ({ label: p.nombre, value: p.id }))}
                        onChange={(e) => setFieldValue("paisId", e.value)}
                        placeholder="Seleccione país"
                        className={`w-full ${errors.paisId && touched.paisId ? "p-invalid" : ""}`}
                      />
                    </div>
                    <ErrorMessage name="paisId" component="small" className="p-error" />
                  </div>
                </div>

                {/* Razón Social y Condición Fiscal */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label>Razón Social</label>
                    <div className="p-inputgroup">
                      <span className="p-inputgroup-addon"><i className="pi pi-briefcase"></i></span>
                      <Dropdown
                        value={values.razonSocialId}
                        options={razonesSociales.map((r) => ({ label: r.nombre, value: r.id }))}
                        onChange={(e) => setFieldValue("razonSocialId", e.value)}
                        placeholder="Seleccione razón social"
                        className={`w-full ${errors.razonSocialId && touched.razonSocialId ? "p-invalid" : ""}`}
                      />
                    </div>
                    <ErrorMessage name="razonSocialId" component="small" className="p-error" />
                  </div>
                  <div>
                    <label>Condición Fiscal</label>
                    <div className="p-inputgroup">
                      <span className="p-inputgroup-addon"><i className="pi pi-file-edit"></i></span>
                      <Dropdown
                        value={values.condicionFiscalId}
                        options={condicionesFiscales.map((c) => ({ label: c.nombre, value: c.id }))}
                        onChange={(e) => setFieldValue("condicionFiscalId", e.value)}
                        placeholder="Seleccione condición fiscal"
                        className={`w-full ${errors.condicionFiscalId && touched.condicionFiscalId ? "p-invalid" : ""}`}
                      />
                    </div>
                    <ErrorMessage name="condicionFiscalId" component="small" className="p-error" />
                  </div>
                </div>

                {/* Observaciones */}
                <div>
                  <label>Observaciones</label>
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon"><i className="pi pi-comment"></i></span>
                    <Field
                      as={InputText}
                      name="observacion"
                      placeholder="Ingrese observaciones"
                      className={`w-full ${errors.observacion && touched.observacion ? "p-invalid" : ""}`}
                    />
                  </div>
                </div>

                <Button type="submit" label="Guardar Cliente" className="btnGuardarCliente mt-2" />
              </Form>
            )}
          </Formik>
        </Card>
      </div>
    </div>
  );
};

export default ClienteForm;
