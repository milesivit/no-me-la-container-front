import { useContext, useRef } from "react"
import { AuthContext } from "../../context/AuthContext"
import {Formik, Form, Field, ErrorMessage} from 'formik'
import * as Yup from 'yup'
import { InputText } from "primereact/inputtext"
import { Password } from 'primereact/password';
import { Card } from "primereact/card"
import { Button } from "primereact/button"
import { Toast } from "primereact/toast"
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom"

const LoginForm = () =>{

    const { login } = useContext(AuthContext)
    const toast = useRef(null)
    const navigate = useNavigate();


    const initialValuesUser = {
        correo:'',
        contrasena:''
    }

    const validationSchemaUser = Yup.object({
        correo: Yup.string().email('Email invalido').required('Campo requerido'),
        contrasena: Yup.string().required('Campo requerido')
    }) 

    const onSubmitLogin = async (values) =>{
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

    return(
        <div>
            <Navbar /> 
            {/* Toast global */}
            <Toast ref={toast} />

            <Card title='Iniciar sesión'>
                <Formik 
                    initialValues={initialValuesUser} 
                    validationSchema={validationSchemaUser} 
                    onSubmit={onSubmitLogin}
                >
                {({handleChange, values})=>(
                    <Form>
                        <label>Email</label>
                        <InputText name='correo' value={values.correo} onChange={handleChange}/>
                        <span className="text-danger"> <ErrorMessage name='correo' /> </span>
                        
                        <label>Contraseña</label> 
                        <Password name='contrasena' value={values.contrasena} onChange={handleChange} toggleMask />
                        <span className="text-danger"> <ErrorMessage name='contrasena' /> </span>
                        
                        <Button label='Iniciar sesión' type='submit' className="mt-3"/>
                    </Form>
                )}
                </Formik>
                <button 
                    type="button" 
                    style={{ cursor: "pointer", border: "none", background: "none", padding: 0 }}
                    onClick={() => navigate('/clave-olvidada')}
                    >
                    <h4>¿Olvidó su contraseña?</h4>
                </button>

            </Card>
        </div>
    )
}

export default LoginForm
