import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Toast } from "primereact/toast";
import homeBanner from "../../img/background2.png";
import "./HomeView.css";

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
  }, [justLoggedIn, setJustLoggedIn]);

  return (
    <>
      <div className="home-container">
        <Toast ref={toast} />

        <div className="banner-wrapper">
          <img
            src={homeBanner}
            alt="Home banner"
            className="home-banner-img"
          />
        </div>
      </div>
    </>
  );
};

export default HomeView;
