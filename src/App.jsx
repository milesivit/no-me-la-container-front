import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { TOAST_REF } from './utils/ToastRef';

import { AuthProvider } from './context/AuthContext';
import { BarcoProvider } from './context/BarcoContext';
import { PersonaProvider } from './context/PersonaContext';
import { PaisProvider } from './context/PaisContext';
import { SexoProvider } from './context/SexoContext';

import './App.css';
import 'primereact/resources/themes/lara-dark-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import LoginForm from './layouts/auth/LoginForm';
import RegisterForm from './layouts/auth/RegisterForm';
import PersonaForm from './layouts/persona/Persona';
import ForgotPassword from './layouts/auth/ForgotPassword';
import ResetPassword from './layouts/auth/ResetPassword';
import Home from './layouts/home/index';
import Barco from './layouts/barco/Barco'

import PrivateRoute from './utils/PrivateRoute';
import PublicRoute from './utils/PublicRoute'; 
import { RequireRole } from "./utils/RequireRole";


function App() {
  return (
    <Router>
      <Toast ref={TOAST_REF} position='top-right'/>
      <AuthProvider>
        <Fragment>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/clave-olvidada" element={<ForgotPassword />} />
            <Route path="/recuperar-contrasenia" element={<ResetPassword />} />

            {/* rutas publicas */}
            <Route
              path="/inicio-sesion"
              element={
                <PublicRoute>
                  <LoginForm />
                </PublicRoute>
              }
            />
            <Route
              path="/registro"
              element={
                <PublicRoute>
                  <RegisterForm />
                </PublicRoute>
              }
            />
            <Route
              path="/flota"
              element={
                  <PrivateRoute>
                    <BarcoProvider>
                      <Barco />
                    </BarcoProvider>
                  </PrivateRoute>
              }
            />
            <Route
              path="/persona/:usuarioId"
              element={
                <PublicRoute>
                  <SexoProvider>
                    <PaisProvider>
                      <PersonaProvider>
                        <PersonaForm />
                      </PersonaProvider>
                    </PaisProvider>
                  </SexoProvider>
                </PublicRoute>
              }
            />
          </Routes>
        </Fragment>
      </AuthProvider>
    </Router>
  );
}

export default App;
