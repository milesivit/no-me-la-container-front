import { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toast } from "primereact/toast";
import { TOAST_REF } from "./utils/ToastRef";

import { AuthProvider } from "./context/AuthContext";
import { BarcoProvider } from "./context/BarcoContext";
import { PaisProvider } from "./context/PaisContext";
import { SexoProvider } from "./context/SexoContext";
import { CargoProvider } from "./context/CargoContext";
import { RazonSocialProvider } from "./context/RazonSocialContext";
import { CondicionFiscalProvider } from "./context/CondicionFiscalContext";
import { ClienteProvider } from "./context/ClienteContext";
import { EmpleadoProvider } from "./context/EmpleadoContext";
import { ContainerProvider } from "./context/ContainerContext";

import "./App.css";
import "primereact/resources/themes/lara-dark-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

// Layouts
import LoginForm from "./layouts/auth/LoginForm";
import RegisterForm from "./layouts/auth/RegisterForm";
import ForgotPassword from "./layouts/auth/ForgotPassword";
import ResetPassword from "./layouts/auth/ResetPassword";
import Home from "./layouts/home";
import Barco from "./layouts/barco/Barco";
import ClienteForm from "./layouts/cliente/ClienteForm";
import EmpleadoForm from "./layouts/empleado/EmpleadoForm";
import CreateBarco from "./layouts/barco/CreateBarco";
import ContainerForm from './layouts/container/Container'
import CreateContainer from './layouts/container/CreateContainer'

// Utils
import PrivateRoute from "./utils/PrivateRoute";
import PublicRoute from "./utils/PublicRoute";
import { RequireRole } from "./utils/RequireRole";
import Container from "quill/blots/container";

function App() {
  return (
    <Router>
      <Toast ref={TOAST_REF} position="top-right" />
      <AuthProvider>
        <Fragment>
          <Routes>
            {/* =========================
                RUTAS PuBLICAS
            ========================== */}
            <Route path="/" element={<Home />} />
            <Route path="/clave-olvidada" element={<ForgotPassword />} />
            <Route path="/recuperar-contrasenia" element={<ResetPassword />} />

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
              path="/crear-cliente/:usuarioId"
              element={
                  <ClienteProvider>
                    <PaisProvider>
                      <SexoProvider>
                        <CondicionFiscalProvider>
                          <RazonSocialProvider>
                            <ClienteForm />
                          </RazonSocialProvider>
                        </CondicionFiscalProvider>
                      </SexoProvider>
                    </PaisProvider>
                  </ClienteProvider>
              }
            />

            <Route
              path="/crear-empleado/:usuarioId"
              element={
                  <EmpleadoProvider>
                    <CargoProvider>
                      <SexoProvider>
                        <PaisProvider>
                          <EmpleadoForm />
                        </PaisProvider>
                      </SexoProvider>
                    </CargoProvider>
                  </EmpleadoProvider>
              }
            />
            {/* =========================
                RUTAS PRIVADAS
            ========================== */}

            {/* Barcos */}
            <Route
              path="/flota"
              element={
                <PrivateRoute>
                  <RequireRole role="admin">
                    <BarcoProvider>
                      <Barco />
                    </BarcoProvider>
                  </RequireRole>
                </PrivateRoute>
              }
            />
            
            <Route
              path="/flota/crear"
              element={
                <PrivateRoute>
                  <RequireRole role="admin">
                    <BarcoProvider>
                      <CreateBarco />
                    </BarcoProvider>
                  </RequireRole>
                </PrivateRoute>
              }
            />

            <Route
              path="/container"
              element={
                <PrivateRoute>
                  <RequireRole role="admin">
                    <ContainerProvider>
                      <ContainerForm/>
                    </ContainerProvider>
                  </RequireRole>
                </PrivateRoute>
              }
            />

            <Route
              path="/container/crear"
              element={
                <PrivateRoute>
                  <RequireRole role="admin">
                    <ContainerProvider>
                      <CreateContainer/>
                    </ContainerProvider>
                  </RequireRole>
                </PrivateRoute>
              }
            />

          </Routes>
        </Fragment>
      </AuthProvider>
    </Router>
  );
}

export default App;
