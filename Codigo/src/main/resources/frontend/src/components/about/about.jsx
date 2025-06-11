import React from "react";
import styles from "./about.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faStar, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const About = () => {
    return (
        <div className={styles.container}>
            <h2>Sobre o FitFlex</h2>
            <p className={styles.description}>O FitFlex é um site feito para ajudar diabéticos a manter uma alimentação saudável sem complicação. Oferecemos receitas seguras, com informações detalhadas sobre nutrientes e índice glicêmico, além de uma inteligência artificial que analisa alimentos a partir de fotos da embalagem, informando se são seguros para o consumo.</p>
            <div className={styles.icons}>
                <p>
                    <FontAwesomeIcon icon={faCircleCheck} style={{ color: "#65f200", marginRight: "8px" }} />
                    Receitas seguras e nutritivas
                </p>
                <p>
                    <FontAwesomeIcon icon={faStar} style={{ color: "#ffc634", marginRight: "8px" }} />
                    Salve suas receitas favoritas
                </p>
                <p>
                    <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: "#2e2020", marginRight: "8px" }} />
                    Análise inteligente de alimentos
                </p>
            </div>
        </div>
    );
};

export default About;
