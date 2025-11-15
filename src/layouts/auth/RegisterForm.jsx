import { useContext, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import "./RegisterForm.css"

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
    <div className="register-page">
      <Toast ref={toast} />
      <div className="register-container">
        <Card title="Registrarse" className="register-card">
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ handleChange, values }) => (
              <Form className="register-form">

                {/* Nombre */}
                <div>
                  <label htmlFor="nombre">Nombre</label>
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-user"></i>
                    </span>
                    <InputText
                      id="nombre"
                      name="nombre"
                      value={values.nombre}
                      onChange={handleChange}
                      placeholder="Nombre"
                    />
                  </div>
                  <ErrorMessage name="nombre" component="small" className="p-error" />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="correo">Email</label>
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-envelope"></i>
                    </span>
                    <InputText
                      id="correo"
                      name="correo"
                      value={values.correo}
                      onChange={handleChange}
                      placeholder="ejemplo@correo.com"
                      keyfilter="email" //Keyfilter de PrimeReact
                    />
                  </div>
                  <ErrorMessage name="correo" component="small" className="p-error" />
                </div>

                {/* Contraseña */}
                <div>
                  <label htmlFor="contrasena">Contraseña</label>
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-lock"></i>
                    </span>
                    <Password
                      id="contrasena"
                      name="contrasena"
                      value={values.contrasena}
                      onChange={handleChange}
                      toggleMask
                      feedback={false}
                      placeholder="********"
                      inputClassName="register-password-input"
                    />
                  </div>
                  <ErrorMessage name="contrasena" component="small" className="p-error" />
                </div>

                {/* Rol */}
                <div>
                  <label htmlFor="rol">Rol</label>
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-users"></i>
                    </span>
                    <select
                      id="rol"
                      name="rol"
                      value={values.rol}
                      onChange={handleChange}
                      className="register-select"
                    >
                      <option value="cliente">Cliente</option>
                      <option value="moderador">Moderador</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <ErrorMessage name="rol" component="small" className="p-error" />
                </div>

                <Button type="submit" label="Registrarse" className="register-btn" />

              </Form>

            )}
          </Formik>
        </Card>
      </div>
    </div>

  );
};

export default RegisterForm;
