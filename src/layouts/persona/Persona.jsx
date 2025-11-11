import { useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PersonaContext } from "../../context/PersonaContext";
import { SexoContext } from "../../context/SexoContext";
import { PaisContext } from "../../context/PaisContext";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import Navbar from "../components/Navbar";

const PersonaForm = () => {
  const { usuarioId } = useParams();
  const { createPersona } = useContext(PersonaContext);
  const { sexos } = useContext(SexoContext);
  const { paises } = useContext(PaisContext);
  const toast = useRef(null);
  const navigate = useNavigate();

  const initialValues = {
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
    direccion: "",
    fecha_nacimiento: null,
    sexoId: "",
    paisId: "",
  };

  const validationSchema = Yup.object({
    nombre: Yup.string().required("Campo requerido"),
    apellido: Yup.string().required("Campo requerido"),
    dni: Yup.string()
      .matches(/^[0-9]+$/, "Solo números")
      .min(7, "DNI inválido")
      .max(8, "DNI inválido")
      .required("Campo requerido"),
    telefono: Yup.string()
      .matches(/^[0-9]+$/, "Solo números")
      .required("Campo requerido"),
    direccion: Yup.string().required("Campo requerido"),
    fecha_nacimiento: Yup.date()
      .nullable()
      .required("Campo requerido"),
    sexoId: Yup.number().required("Seleccione un sexo"),
    paisId: Yup.number().required("Seleccione un país"),
  });

  const onSubmit = async (values, { resetForm }) => {
    const dataToSend = {
      ...values,
      usuarioId: Number(usuarioId),
    };

    try {
      await createPersona(dataToSend);
      resetForm();
      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Persona registrada correctamente",
        life: 3000,
      });
      setTimeout(() => navigate("/inicio-sesion"), 1500);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: ErrorMessage,
        detail: "No se pudo registrar la persona",
        life: 3000,
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <Toast ref={toast} />

      <div className="flex justify-center items-center flex-1 p-6">
        <Card title="Registro de Persona" className="shadow-lg w-full max-w-md">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ handleChange, setFieldValue, values }) => (
              <Form className="flex flex-col gap-4">
                {/* Nombre */}
                <div>
                  <label htmlFor="nombre" className="block mb-1 font-semibold">
                    Nombre
                  </label>
                  <InputText
                    id="nombre"
                    name="nombre"
                    className="w-full"
                    value={values.nombre}
                    onChange={handleChange}
                  />
                  <ErrorMessage
                    name="nombre"
                    component="small"
                    className="p-error block"
                  />
                </div>

                {/* Apellido */}
                <div>
                  <label htmlFor="apellido" className="block mb-1 font-semibold">
                    Apellido
                  </label>
                  <InputText
                    id="apellido"
                    name="apellido"
                    className="w-full"
                    value={values.apellido}
                    onChange={handleChange}
                  />
                  <ErrorMessage
                    name="apellido"
                    component="small"
                    className="p-error block"
                  />
                </div>

                {/* DNI */}
                <div>
                  <label htmlFor="dni" className="block mb-1 font-semibold">
                    DNI
                  </label>
                  <InputNumber
                    id="dni"
                    name="dni"
                    className="w-full"
                    value={values.dni}
                    onValueChange={(e) => setFieldValue("dni", e.value)}
                    useGrouping={false}
                  />
                  <ErrorMessage
                    name="dni"
                    component="small"
                    className="p-error block"
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label htmlFor="telefono" className="block mb-1 font-semibold">
                    Teléfono
                  </label>
                  <InputText
                    id="telefono"
                    name="telefono"
                    className="w-full"
                    value={values.telefono}
                    onChange={handleChange}
                  />
                  <ErrorMessage
                    name="telefono"
                    component="small"
                    className="p-error block"
                  />
                </div>

                {/* Dirección */}
                <div>
                  <label htmlFor="direccion" className="block mb-1 font-semibold">
                    Dirección
                  </label>
                  <InputText
                    id="direccion"
                    name="direccion"
                    className="w-full"
                    value={values.direccion}
                    onChange={handleChange}
                  />
                  <ErrorMessage
                    name="direccion"
                    component="small"
                    className="p-error block"
                  />
                </div>

                {/* Fecha de nacimiento */}
                <div>
                  <label htmlFor="fecha_nacimiento" className="block mb-1 font-semibold">
                    Fecha de Nacimiento
                  </label>
                  <Calendar
                    id="fecha_nacimiento"
                    name="fecha_nacimiento"
                    value={values.fecha_nacimiento}
                    onChange={(e) => setFieldValue("fecha_nacimiento", e.value)}
                    dateFormat="dd/mm/yy"
                    showIcon
                    className="w-full"
                  />
                  <ErrorMessage
                    name="fecha_nacimiento"
                    component="small"
                    className="p-error block"
                  />
                </div>

                {/* Sexo */}
                <div>
                  <label htmlFor="sexoId" className="block mb-1 font-semibold">
                    Sexo
                  </label>
                  <Dropdown
                    id="sexoId"
                    name="sexoId"
                    value={values.sexoId}
                    options={sexos}
                    optionLabel="nombre"
                    optionValue="id"
                    placeholder="Seleccione un sexo"
                    onChange={(e) => setFieldValue("sexoId", e.value)}
                    className="w-full"
                  />
                  <ErrorMessage name="sexoId" component="small" className="p-error block" />
                </div>

                {/* País */}
                <div>
                  <label htmlFor="paisId" className="block mb-1 font-semibold">
                    País
                  </label>
                  <Dropdown
                    id="paisId"
                    name="paisId"
                    value={values.paisId}
                    options={paises}
                    optionLabel="nombre"  
                    optionValue="id"
                    placeholder="Seleccione un país"
                    onChange={(e) => setFieldValue("paisId", e.value)}
                    className="w-full"
                  />
                  <ErrorMessage name="paisId" component="small" className="p-error block" />
                </div>


                {/* Botón */}
                <Button
                  type="submit"
                  label="Guardar"
                  className="w-full mt-4"
                />
              </Form>
            )}
          </Formik>
        </Card>
      </div>
    </div>
  );
};

export default PersonaForm;
