import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const { forgotPassword } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const ForgotSchema = Yup.object({
    correo: Yup.string()
      .email("Email inválido")
      .required("El email es obligatorio"),
  });

  return (
    <div className="forgot-page">
      <div className="forgot-container">
        <Card title="Recuperar contraseña" className="forgot-card">
          <p className="forgot-description">
            Ingresá tu email y te enviaremos un enlace de recuperación.
          </p>

          <Formik
            initialValues={{ correo: "" }}
            validationSchema={ForgotSchema}
            onSubmit={async (values, { resetForm }) => {
              setLoading(true);
              const response = await forgotPassword(values.correo);
              if (response) resetForm();
              setLoading(false);
            }}
          >
            <Form className="forgot-form">
              <label htmlFor="correo">Email</label>

              <Field name="correo">
                {({ field }) => (
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-envelope"></i>
                    </span>
                    <InputText
                      id="correo"
                      {...field}
                      placeholder="ejemplo@gmail.com"
                      keyfilter="email"
                    />
                  </div>
                )}
              </Field>

              <ErrorMessage
                name="correo"
                component="small"
                className="p-error"
              />

              <Button
                type="submit"
                label={loading ? "Enviando..." : "Enviar email"}
                icon={loading ? "pi pi-spin pi-spinner" : "pi pi-send"}
                disabled={loading}
                className="forgot-btn"
              />
            </Form>
          </Formik>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
