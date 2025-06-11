import styles from "./footer.module.css";
import React from "react";
import { NavLink } from "react-router-dom";

const Footer = () => (
  <footer className={styles.footerContainer}>
    <div className={styles.footerContent}>
      <span>&copy; 2025 FitFlex. Todos os direitos reservados.</span>
      <NavLink to="/termosuso" className={styles.termosLink}>
         Termos de Uso
      </NavLink>
    </div>
  </footer>
);

export default Footer;