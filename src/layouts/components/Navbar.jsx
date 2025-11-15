import React, { useContext } from "react";
import { Menubar } from "primereact/menubar";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const items = user
    ? [
        //solo visible si el usuario es admin
        ...(user.rol === "admin"
          ? [
              {
                label: "Barcos",
                icon: "pi pi-compass",
                template: (item, options) => (
                  <Link to="/flota" className={options.className}>
                    <i className={item.icon}></i>
                    <span className="ml-2">{item.label}</span>
                  </Link>
                ),
              },

              {
                label: "Containers",
                icon: "pi pi-warehouse",
                template: (item, options) => (
                  <Link to="/container" className={options.className}>
                    <i className={item.icon}></i>
                    <span className="ml-2">{item.label}</span>
                  </Link>
                ),
              },
            ]
          : []),
        {
          label: "Cerrar sesión",
          icon: "pi pi-sign-out",
          command: () => {
            logout();
            navigate("/inicio-sesion");
          },
        },
      ]
    : [
        {
          label: "Registro",
          icon: "pi pi-user-plus",
          template: (item, options) => (
            <Link to="/registro" className={options.className}>
              <i className={item.icon}></i>
              <span className="ml-2">{item.label}</span>
            </Link>
          ),
        },
        {
          label: "Inicio de sesión",
          icon: "pi pi-sign-in",
          template: (item, options) => (
            <Link to="/inicio-sesion" className={options.className}>
              <i className={item.icon}></i>
              <span className="ml-2">{item.label}</span>
            </Link>
          ),
        },
      ];

  const start = (
    <Link to="/" className="flex items-center gap-2 text-lg font-bold no-underline">
      <i className="pi pi-home"></i>
      <span>Home</span>
    </Link>
  );

  const end = user ? (
    <div className="flex items-center gap-2">
      <span className="px-2 py-1 rounded-full text-white text-xs">
        Tu rol es: {user.rol.charAt(0).toUpperCase() + user.rol.slice(1)}
      </span>
    </div>
  ) : null;

  return (
    <div
      className="navbar-container"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
      }}
    >
      <Menubar model={items} start={start} end={end} />
    </div>
  );
};

export default Navbar;
