import React, { useContext, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import { AuthContext } from "../../context/AuthContext";
import { Toast } from "primereact/toast";

const HomeView = () => {
  const { justLoggedIn, setJustLoggedIn } = useContext(AuthContext);
  const toast = useRef(null);
  const shownRef = useRef(false);

  useEffect(() => {
    if (justLoggedIn && !shownRef.current) {
      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Sesión iniciada con éxito",
        life: 3000,
      });
      setJustLoggedIn(false);
      shownRef.current = true;
    }
  }, [justLoggedIn]);
  
  return (
    <div>
      <Navbar />
      <Toast ref={toast} />
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h1>Bienvenido al CRUD de productos y usuarios</h1>
        <h4>
          (Aplicación fullstack en JavaScript donde el frontend (React) consume los datos expuestos por el backend (Express), permitiendo realizar CRUDs completos)
        </h4>
      </div>
    </div>
  );
};

export default HomeView;
