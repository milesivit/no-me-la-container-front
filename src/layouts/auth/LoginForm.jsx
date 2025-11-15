import { useContext, useRef } from "react"
import { AuthContext } from "../../context/AuthContext"
import { Formik, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { InputText } from "primereact/inputtext"
import { Password } from 'primereact/password';
import { Card } from "primereact/card"
import { Button } from "primereact/button"
import { Toast } from "primereact/toast"
import { useNavigate } from "react-router-dom"
import "./LoginForm.css"
import 'primeicons/primeicons.css';

const LoginForm = () => {

    const { login } = useContext(AuthContext)
    const toast = useRef(null)
    const navigate = useNavigate();

    const initialValuesUser = {
        correo: '',
        contrasena: ''
    }

    const validationSchemaUser = Yup.object({
        correo: Yup.string().email('Email inválido').required('Campo requerido'),
        contrasena: Yup.string().required('Campo requerido')
    })

    const onSubmitLogin = async (values) => {
        try {
            await login(values)

        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Credenciales inválidas',
                life: 3000
            })
        }
    }

    return (
        <div className="login-page">
            <Toast ref={toast} />

            <div className="login-container">
                <Card title="Iniciar sesión" className="login-card">

                    <Formik
                        initialValues={initialValuesUser}
                        validationSchema={validationSchemaUser}
                        onSubmit={onSubmitLogin}
                    >
                        {({ handleChange, values }) => (
                            <Form className="login-form">

                                {/* Email */}
                                <div className="form-group">
                                    <label>Email</label>

                                    <div className="p-inputgroup flex-1">
                                        <span className="p-inputgroup-addon">
                                            <i className="pi pi-envelope"></i>
                                        </span>
                                        <InputText
                                            name="correo"
                                            value={values.correo}
                                            onChange={handleChange}
                                            placeholder="Ingrese su correo"
                                        />
                                    </div>

                                    <ErrorMessage name="correo" component="span" className="error-text" />
                                </div>

                                {/* Contraseña */}
                                <div className="form-group">
                                    <label>Contraseña</label>

                                    <div className="p-inputgroup flex-1">
                                        <span className="p-inputgroup-addon">
                                            <i className="pi pi-lock"></i>
                                        </span>
                                        <Password
                                            name="contrasena"
                                            value={values.contrasena}
                                            onChange={handleChange}
                                            toggleMask
                                            placeholder="Ingrese su contraseña"
                                            inputClassName="login-input"
                                        />
                                    </div>

                                    <ErrorMessage name="contrasena" component="span" className="error-text" />
                                </div>

                                <Button
                                    label="Iniciar sesión"
                                    type="submit"
                                    className="login-btn"
                                />

                            </Form>
                        )}
                    </Formik>

                    <button
                        type="button"
                        className="forgot-password-btn"
                        onClick={() => navigate('/clave-olvidada')}
                    >
                        ¿Olvidó su contraseña?
                    </button>

                </Card>
            </div>

        </div>
    )
}

export default LoginForm
