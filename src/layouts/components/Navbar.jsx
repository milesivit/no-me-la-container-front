import React, { useContext } from "react";
import { Menubar } from "primereact/menubar";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Navbar.css";
import logo from "../../img/logo.png";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // 🎯 ITEMS DEL MENÚ (centro)
  const items = user
    ? [
        ...(user.rol === "admin"
          ? [
              {
                label: "Barcos",
                icon: "pi pi-compass",
                template: (item, options) => (
                  <Link to="/flota" className={`navbar-link ${options.className}`}>
                    <i className={item.icon}></i>
                    <span>{item.label}</span>
                  </Link>
                ),
              },
              {
                label: "Containers",
                icon: "pi pi-warehouse",
                template: (item, options) => (
                  <Link to="/container" className={`navbar-link ${options.className}`}>
                    <i className={item.icon}></i>
                    <span>{item.label}</span>
                  </Link>
                ),
              }
            ]
          : []),

        {
          label: "Productos",
          icon: "pi pi-box",
          template: (item, options) => (
            <Link to="/productos" className={`navbar-link ${options.className}`}>
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </Link>
          ),
        },
      ]
    : [];

  // 🎯 LOGO (izquierda)
  const start = (
    <Link to="/" className="navbar-logo">
      <img src={logo} alt="Logo" className="navbar-logo-img" />
      <span className="navbar-logo-text">NOMELA CONTAINER</span>
    </Link>
  );

  // 🎯 ZONA DERECHA
  const end = user ? (
    <div className="navbar-user-info" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <span className="navbar-role-badge">
        {user.rol.charAt(0).toUpperCase() + user.rol.slice(1)}
      </span>

      <button
        className="navbar-btn-outline"
        onClick={() => {
          logout();
          navigate("/inicio-sesion");
        }}
      >
        Cerrar sesión
      </button>
    </div>
  ) : (
    <div className="navbar-auth-buttons" style={{ display: "flex", gap: "10px" }}>
      <Link to="/registro" className="navbar-btn-outline">
        <i className="pi pi-user-plus"></i> Registro
      </Link>

      <Link to="/inicio-sesion" className="navbar-btn-primary">
        <i className="pi pi-sign-in"></i> Iniciar sesión
      </Link>
    </div>
  );

  return (
    <div className="navbar-container">
      <Menubar model={items} start={start} end={end} />
    </div>
  );
};

export default Navbar;
