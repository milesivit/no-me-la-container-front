import React, { useContext } from "react";
import { Menubar } from "primereact/menubar";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const items = user
    ? [
        {
          label: "Usuarios",
          icon: "pi pi-users",
          template: (item, options) => (
            <Link to="#" className={options.className}>
              <i className={item.icon}></i>
              <span className="ml-2">{item.label}</span>
            </Link>
          ),
        },
        {
          label: "Productos",
          icon: "pi pi-box",
          template: (item, options) => (
            <Link to="#" className={options.className}>
              <i className={item.icon}></i>
              <span className="ml-2">{item.label}</span>
            </Link>
          ),
        },
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
      <span className={`px-2 py-1 rounded-full text-white text-xs `}>
        tu rol es: {user.rol.charAt(0).toUpperCase() + user.rol.slice(1)}
      </span>
    </div>
  ) : null;

  return (
    <div className="card">
      <Menubar model={items} start={start} end={end}/>
    </div>
  );
};

export default Navbar;
