import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const ResetPassword = () => {
  const resetSchema = Yup.object({
    contrasena: Yup.string()
      .min(6, "Mínimo 6 caracteres")
      .required("La contraseña es requerida"),
    confirm: Yup.string()
      .oneOf([Yup.ref("contrasena")], "Las contraseñas no coinciden")
      .required("Repetir la contraseña es obligatorio"),
  });

  const { ResetPassword } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({ token: "", id: "" });

  useEffect(() => {
    const url = new URLSearchParams(window.location.search);
    setParams({
      token: url.get("token") || "",
      id: url.get("id") || "",
    });
  }, []);

  const invalidLink = !params.token || !params.id;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex justify-center items-center flex-1 p-6">
        <Card title="Nueva contraseña" className="w-full max-w-md shadow-lg">
          {invalidLink ? (
            <h5 className="text-red-500">Enlace inválido o incompleto</h5>
          ) : (
            <Formik
              initialValues={{ contrasena: "", confirm: "" }}
              validationSchema={resetSchema}
              onSubmit={async (values, { resetForm }) => {
                setLoading(true);
                const response = await ResetPassword({
                  id: params.id,
                  token: params.token,
                  contrasena: values.contrasena,
                });
                if (response) {
                  resetForm();
                  navigate("/inicio-sesion");
                }
                setLoading(false);
              }}
            >
              {({ values, handleChange, handleBlur }) => (
                <Form className="flex flex-col gap-3">
                  <label htmlFor="contrasena" className="font-semibold">
                    Nueva contraseña
                  </label>
                  <Password
                    id="contrasena"
                    name="contrasena"
                    value={values.contrasena}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    feedback={false}
                    placeholder="Nueva contraseña"
                    className="w-full"
                  />
                  <ErrorMessage
                    name="contrasena"
                    component="small"
                    className="p-error block mt-1"
                  />

                  <label htmlFor="confirm" className="font-semibold">
                    Repetir contraseña
                  </label>
                  <Password
                    id="confirm"
                    name="confirm"
                    value={values.confirm}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    feedback={false}
                    placeholder="Repetir contraseña"
                    className="w-full"
                  />
                  <ErrorMessage
                    name="confirm"
                    component="small"
                    className="p-error block mt-1"
                  />

                  <Button
                    type="submit"
                    label={loading ? "Guardando..." : "Guardar contraseña"}
                    icon={loading ? "pi pi-spin pi-spinner" : "pi pi-send"}
                    disabled={loading}
                    className="mt-2"
                  />
                </Form>
              )}
            </Formik>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
