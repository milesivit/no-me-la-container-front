import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './layouts/home/index';

import { AuthProvider } from './context/AuthContext';
import { Toast } from 'primereact/toast';
import { TOAST_REF } from './utils/ToastRef';

import './App.css';
import 'primereact/resources/themes/lara-dark-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import LoginForm from './layouts/auth/LoginForm';
import RegisterForm from './layouts/auth/RegisterForm';
import ForgotPassword from './layouts/auth/ForgotPassword';
import ResetPassword from './layouts/auth/ResetPassword';

import PrivateRoute from './utils/PrivateRoute';
import PublicRoute from './utils/PublicRoute'; 


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
          </Routes>
        </Fragment>
      </AuthProvider>
    </Router>
  );
}

export default App;
