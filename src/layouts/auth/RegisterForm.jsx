import { useContext, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import Navbar from "../components/Navbar";

const RegisterForm = () => {
  const { register } = useContext(AuthContext);
  const toast = useRef(null);

  const initialValues = {
    nombre: "",
    correo: "",
    contrasena: "",
    rol: "cliente",
  };

  const validationSchema = Yup.object({
    nombre: Yup.string().required("Campo requerido"),
    correo: Yup.string().email("Email inválido").required("Campo requerido"),
    contrasena: Yup.string().min(6, "Mínimo 6 caracteres").required("Campo requerido"),
    rol: Yup.string().required("Campo requerido"),
  });

  const onSubmit = async (values, { resetForm }) => {
    const dataToSend = {
      nombre: values.nombre,
      correo: values.correo,
      contrasena: values.contrasena,
      rol: values.rol,
      activo: true,
    };
  
    try {
      await register(dataToSend);
      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Usuario registrado correctamente",
        life: 3000,
      });
      resetForm();
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo registrar el usuario",
        life: 3000,
      });
    }
  };
  

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <Toast ref={toast} />
      <div className="flex justify-center items-center flex-1 p-6">
        <Card title="Registrarse" className="shadow-lg w-full max-w-md">
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ handleChange, values }) => (
              <Form className="flex flex-col gap-4">
                {/* Nombre */}
                <div>
                  <label htmlFor="nombre" className="block mb-1 font-semibold">Nombre</label>
                  <InputText id="nombre" name="nombre" className="w-full" value={values.nombre} onChange={handleChange} />
                  <ErrorMessage name="nombre" component="small" className="p-error block" />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="correo" className="block mb-1 font-semibold">Email</label>
                  <InputText id="correo" name="correo" className="w-full" value={values.correo} onChange={handleChange} />
                  <ErrorMessage name="correo" component="small" className="p-error block" />
                </div>

                {/* Contraseña */}
                <div>
                  <label htmlFor="contrasena" className="block mb-1 font-semibold">Contraseña</label>
                  <Password id="contrasena" name="contrasena" className="w-full" value={values.contrasena} onChange={handleChange} toggleMask feedback={false} />
                  <ErrorMessage name="contrasena" component="small" className="p-error block" />
                </div>

                {/* Rol */}
                <div>
                  <label htmlFor="rol" className="block mb-1 font-semibold">Rol</label>
                  <select id="rol" name="rol" value={values.rol} onChange={handleChange} className="w-full p-2 border rounded-md">
                    <option value="cliente">Cliente</option>
                    <option value="moderador">Moderador</option>
                    <option value="admin">Admin</option>
                  </select>
                  <ErrorMessage name="rol" component="small" className="p-error block" />
                </div>

                <Button type="submit" label="Registrarse" className="w-full mt-4" />
              </Form>
            )}
          </Formik>
        </Card>
      </div>
    </div>
  );
};

export default RegisterForm;
