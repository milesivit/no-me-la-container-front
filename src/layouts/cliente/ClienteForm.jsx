import React, { useRef, useContext, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import Navbar from "../components/Navbar";
import { useParams, useNavigate } from "react-router-dom";

import { ClienteContext } from "../../context/ClienteContext";
import { SexoContext } from "../../context/SexoContext";
import { PaisContext } from "../../context/PaisContext";
import { CondicionFiscalContext } from "../../context/CondicionFiscalContext";
import { RazonSocialContext } from "../../context/RazonSocialContext";

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
    fecha_nacimiento: Yup.date().required("La fecha de nacimiento es obligatoria"),
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
    fecha_nacimiento: null,
    observacion: "",
  };

  const onSubmit = async (values, { resetForm }) => {
    const nuevoCliente = {
      ...values,
      usuarioId: parseInt(usuarioId),
      activo: true,
    };

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
      console.error("Error al crear cliente:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo crear el cliente",
        life: 3000,
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <Toast ref={toast} />
      <div className="flex justify-center items-start flex-1 p-6 mt-6">
        <Card title="Completar Datos del Cliente" className="shadow-lg w-full max-w-2xl">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ errors, touched, setFieldValue, values }) => (
              <Form className="flex flex-col gap-4">
                {/* Nombre */}
                <div>
                  <label htmlFor="nombre" className="block mb-1 font-semibold">
                    Nombre
                  </label>
                  <Field
                    as={InputText}
                    id="nombre"
                    name="nombre"
                    className={`w-full ${errors.nombre && touched.nombre ? "p-invalid" : ""}`}
                  />
                  <ErrorMessage name="nombre" component="small" className="p-error block" />
                </div>

                {/* Apellido */}
                <div>
                  <label htmlFor="apellido" className="block mb-1 font-semibold">
                    Apellido
                  </label>
                  <Field
                    as={InputText}
                    id="apellido"
                    name="apellido"
                    className={`w-full ${errors.apellido && touched.apellido ? "p-invalid" : ""}`}
                  />
                  <ErrorMessage name="apellido" component="small" className="p-error block" />
                </div>

                {/* DNI y CUIL */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="dni" className="block mb-1 font-semibold">DNI</label>
                    <Field as={InputText} id="dni" name="dni" className="w-full" />
                    <ErrorMessage name="dni" component="small" className="p-error block" />
                  </div>
                  <div>
                    <label htmlFor="cuil" className="block mb-1 font-semibold">CUIL</label>
                    <Field as={InputText} id="cuil" name="cuil" className="w-full" />
                    <ErrorMessage name="cuil" component="small" className="p-error block" />
                  </div>
                </div>

                {/* Teléfono y Dirección */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="telefono" className="block mb-1 font-semibold">Teléfono</label>
                    <Field as={InputText} id="telefono" name="telefono" className="w-full" />
                    <ErrorMessage name="telefono" component="small" className="p-error block" />
                  </div>
                  <div>
                    <label htmlFor="direccion" className="block mb-1 font-semibold">Dirección</label>
                    <Field as={InputText} id="direccion" name="direccion" className="w-full" />
                    <ErrorMessage name="direccion" component="small" className="p-error block" />
                  </div>
                </div>

                {/* Fecha de nacimiento */}
                <div>
                  <label htmlFor="fecha_nacimiento" className="block mb-1 font-semibold">
                    Fecha de nacimiento
                  </label>
                  <Calendar
                    id="fecha_nacimiento"
                    value={values.fecha_nacimiento}
                    onChange={(e) => setFieldValue("fecha_nacimiento", e.value)}
                    dateFormat="dd/mm/yy"
                    showIcon
                    className={`w-full ${errors.fecha_nacimiento && touched.fecha_nacimiento ? "p-invalid" : ""}`}
                  />
                  <ErrorMessage name="fecha_nacimiento" component="small" className="p-error block" />
                </div>

                {/* Dropdowns */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-semibold">Sexo</label>
                    <Dropdown
                      value={values.sexoId}
                      options={sexos.map((s) => ({ label: s.nombre, value: s.id }))}
                      onChange={(e) => setFieldValue("sexoId", e.value)}
                      placeholder="Seleccione"
                      className="w-full"
                    />
                    <ErrorMessage name="sexoId" component="small" className="p-error block" />
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold">País</label>
                    <Dropdown
                      value={values.paisId}
                      options={paises.map((p) => ({ label: p.nombre, value: p.id }))}
                      onChange={(e) => setFieldValue("paisId", e.value)}
                      placeholder="Seleccione"
                      className="w-full"
                    />
                    <ErrorMessage name="paisId" component="small" className="p-error block" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-semibold">Razón Social</label>
                    <Dropdown
                      value={values.razonSocialId}
                      options={razonesSociales.map((r) => ({ label: r.nombre, value: r.id }))}
                      onChange={(e) => setFieldValue("razonSocialId", e.value)}
                      placeholder="Seleccione"
                      className="w-full"
                    />
                    <ErrorMessage name="razonSocialId" component="small" className="p-error block" />
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold">Condición Fiscal</label>
                    <Dropdown
                      value={values.condicionFiscalId}
                      options={condicionesFiscales.map((c) => ({ label: c.nombre, value: c.id }))}
                      onChange={(e) => setFieldValue("condicionFiscalId", e.value)}
                      placeholder="Seleccione"
                      className="w-full"
                    />
                    <ErrorMessage name="condicionFiscalId" component="small" className="p-error block" />
                  </div>
                </div>

                {/* Observaciones */}
                <div>
                  <label htmlFor="observacion" className="block mb-1 font-semibold">
                    Observaciones
                  </label>
                  <Field as={InputText} id="observacion" name="observacion" className="w-full" />
                </div>

                <Button type="submit" label="Guardar Cliente" className="w-full mt-2" />
              </Form>
            )}
          </Formik>
        </Card>
      </div>
    </div>
  );
};

export default ClienteForm;
