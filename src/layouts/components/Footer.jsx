import React from "react";
import { Divider } from "primereact/divider";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">

      <div className="footer-bottom">
        © {new Date().getFullYear()} Nomela Container — Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
