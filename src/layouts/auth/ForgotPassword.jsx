import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from 'yup';
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";

const ForgotPassword = () => {
  const { forgotPassword } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const ForgotSchema = Yup.object({
    correo: Yup.string().email('Email inválido').required('El email es obligatorio'),
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex justify-center items-center flex-1 p-6">
        <Card title="Recuperar contraseña" className="w-full max-w-md shadow-lg">
          <p className="mb-4 text-gray-700">
            Ingresá tu email y te enviaremos un enlace de recuperación.
          </p>

          <Formik
            initialValues={{ correo: '' }}
            validationSchema={ForgotSchema}
            onSubmit={async (values, { resetForm }) => {
              setLoading(true);
              const response = await forgotPassword(values.correo);
              if (response) resetForm();
              setLoading(false);
            }}
          >
            <Form className="flex flex-col gap-3">
              <label htmlFor="correo" className="font-semibold">Email</label>
              <Field name="correo">
                {({ field }) => (
                  <InputText
                    id="correo"
                    {...field}
                    placeholder="ejemplo@gmail.com"
                    className="w-full"
                  />
                )}
              </Field>

              <ErrorMessage
                name="correo"
                component="small"
                className="p-error block"
              />

              <Button
                type="submit"
                label={loading ? "Enviando..." : "Enviar email"}
                icon={loading ? "pi pi-spin pi-spinner" : "pi pi-send"}
                disabled={loading}
                className="mt-2"
              />
            </Form>
          </Formik>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
