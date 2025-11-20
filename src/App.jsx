import { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toast } from "primereact/toast";
import { TOAST_REF } from "./utils/ToastRef";

import "./App.css";
import "primereact/resources/themes/lara-light-teal/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

// Contexts
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
import { ContainerEstadoProvider } from "./context/ContainerEstadoContext";
import { ServicioAgregadoProvider } from "./context/ServicioAgregadoContext";
import { PuertoProvider } from "./context/PuertoContext";
import { ViajeEstadoProvider } from "./context/ViajeEstadoContext";
import { ViajeProvider } from "./context/ViajeContext";
import { ViajeEmpleadoProvider } from "./context/ViajeEmpleadoContext";
import { CargaContainerProvider } from "./context/CargaContainerContext";
import { CategoriaCargaProvider } from "./context/CategoriaCargaContext"; 

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
import CreateContainerEstado from "./layouts/container/CreateContainerEstado";
import ServicioAgregadoForm from "./layouts/servicios/ServicioForm";
import CrearServicioAgregado from "./layouts/servicios/CrearServicioAgregado";
import ViajeForm from "./layouts/viaje/ViajeForm";
import CreateViaje from "./layouts/viaje/CreateViaje";
import EmpleadoTablaForm from "./layouts/empleado/Empleado";
import EmpleadosConViajes from "./layouts/empleado/EmpleadosConViajes";
import CrearViajeEmpleado from "./layouts/empleado/CrearViajeEmpleado";
import EmpleadoViajesModerador from "./layouts/viaje/EmpleadoViajesModerador";
import CreateCargaContainer from "./layouts/cargaContainer/CreateCargaContainer";
import AsignarViaje from "./layouts/viaje/AsignarViaje";

import Footer from "./layouts/components/Footer"; 
import Navbar from "./layouts/components/Navbar";

// Utils
import PrivateRoute from "./utils/PrivateRoute";
import PublicRoute from "./utils/PublicRoute";
import { RequireRole } from "./utils/RequireRole";

function App() {
  return (
    <div className="app-container">
      <Router>
        <Toast ref={TOAST_REF} position="top-right" />
        <AuthProvider>

        <Navbar />

          {/* TODO EL CONTENIDO DE LA APP */}
          <main className="app-main">
            <Routes>
              {/* =========================
                  RUTAS PÚBLICAS
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
                        <ContainerForm />
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
                        <CreateContainer />
                      </ContainerProvider>
                    </RequireRole>
                  </PrivateRoute>
                }
              />

              <Route
                path="/container/estado/crear"
                element={
                  <PrivateRoute>
                    <RequireRole role="admin">
                      <ContainerEstadoProvider>
                        <CreateContainerEstado />
                      </ContainerEstadoProvider>
                    </RequireRole>
                  </PrivateRoute>
                }
              />

            <Route
                path="/servicio"
                element={
                  <PrivateRoute>
                    <RequireRole role="admin">
                      <ServicioAgregadoProvider>
                        <ServicioAgregadoForm />
                      </ServicioAgregadoProvider>
                    </RequireRole>
                  </PrivateRoute>
                }
              />

            <Route
                path="/servicio/crear"
                element={
                  <PrivateRoute>
                    <RequireRole role="admin">
                      <ServicioAgregadoProvider>
                        <CrearServicioAgregado />
                      </ServicioAgregadoProvider>
                    </RequireRole>
                  </PrivateRoute>
                }
              />

            <Route
              path="/viaje"
              element={
                <PrivateRoute>
                  <RequireRole role="admin">
                    <PuertoProvider>
                      <ViajeEstadoProvider>
                        <BarcoProvider>
                          <ViajeProvider>
                            <ViajeForm />
                          </ViajeProvider>
                        </BarcoProvider>
                      </ViajeEstadoProvider>
                    </PuertoProvider>
                  </RequireRole>
                </PrivateRoute>
              }
            />

            <Route
              path="/viaje/crear"
              element={
                <PrivateRoute>
                  <RequireRole role="admin">
                    <PuertoProvider>
                      <ViajeEstadoProvider>
                        <BarcoProvider>
                          <ViajeProvider>
                            <CreateViaje />
                          </ViajeProvider>
                        </BarcoProvider>
                      </ViajeEstadoProvider>
                    </PuertoProvider>
                  </RequireRole>
                </PrivateRoute>
              }
            />
            <Route
              path="/empleado"
              element={
                <PrivateRoute>
                  <RequireRole role="admin">
                    <EmpleadoProvider>
                      <EmpleadoTablaForm />
                    </EmpleadoProvider>
                  </RequireRole>
                </PrivateRoute>
              }
            />

            <Route
              path="/empleado/viajes/:id"
              element={
                <PrivateRoute>
                  <RequireRole role="admin">
                    <ViajeEmpleadoProvider>
                      <EmpleadosConViajes />
                    </ViajeEmpleadoProvider>
                  </RequireRole>
                </PrivateRoute>
              }
            />

            <Route
              path="/viajeempleado/crear/:id"
              element={
                <PrivateRoute>
                  <RequireRole role="admin">
                    <ViajeEmpleadoProvider>
                      <ViajeProvider>
                        <CrearViajeEmpleado />
                      </ViajeProvider>
                    </ViajeEmpleadoProvider>
                  </RequireRole>
                </PrivateRoute>
              }
            />

            <Route
              path="/moderador/viajes/asignados/:id"
              element={
                <PrivateRoute>
                  <RequireRole role="moderador">
                    <ViajeEmpleadoProvider>
                      <EmpleadoViajesModerador />
                    </ViajeEmpleadoProvider>
                  </RequireRole>
                </PrivateRoute>
              }
            />

              <Route
                path="/cargacontainer"
                element={
                  <PrivateRoute>
                    <CategoriaCargaProvider>
                      <CargaContainerProvider>
                        <ContainerProvider>
                          <CreateCargaContainer />
                        </ContainerProvider>
                      </CargaContainerProvider>
                    </CategoriaCargaProvider>
                  </PrivateRoute>
                }
              />

              <Route
                path="/asignar-viaje/:id"
                element={
                  <PrivateRoute>
                      <ViajeProvider>
                        <ContainerProvider>
                          <CargaContainerProvider>
                            <AsignarViaje />
                          </CargaContainerProvider>
                        </ContainerProvider>
                      </ViajeProvider>
                  </PrivateRoute>
                }
              />

            </Routes>
          </main>
        </AuthProvider>
      </Router>
      <Footer />
    </div>
  );
}
export default App;