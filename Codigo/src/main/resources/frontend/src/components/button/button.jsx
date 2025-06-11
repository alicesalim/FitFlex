import React from "react";
import { useNavigate } from "react-router-dom"
import styles from "./button.module.css";
;

const Button = ({ cor, texto, destino }) => {
    const navigate = useNavigate();
  return (
    <button className={styles.button} style={{ backgroundColor: cor }} onClick={() => navigate(destino)}>
        <div className={styles.texto}>{texto}</div>
    </button>
  );
};

export default Button;

