import React, { useContext, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import { AuthContext } from "../../context/AuthContext";
import { Toast } from "primereact/toast";
import background from "../../img/background.png";

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
      <div
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "600px", // mismo alto que la imagen
          width: "1296px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          textShadow: "1px 1px 4px rgba(0,0,0,0.7)",
        }}
      >
      </div>
    </div>
  );
};

export default HomeView;
