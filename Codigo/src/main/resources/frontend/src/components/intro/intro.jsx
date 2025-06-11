import Button from "../button/button";
import React from "react";
import styles from "./intro.module.css";
import { useAuth } from "../../contexts/AuthContext";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate} from 'react-router-dom';

const Intro = (handleButtonClick) => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className={styles.back}>
            <div className={styles.container}>
                <div className={styles.cardimage}>
                    <div className={styles.bgLeft} style={{ backgroundImage: `url("/assets/majericao.png")` }}></div>
                    <div className={styles.bgRight} style={{ backgroundImage: `url("/assets/tomates_home.png")` }}></div>
                    <div className={styles.text}>
                        <h1 className={styles.title}>Comer bem nunca foi tão <br />fácil para <span className={styles.green}>diabéticos!</span></h1>
                        <p className={styles.subtitle}>Descubra opções práticas, saborosas e seguras para manter a<br /> glicemia sob controle no dia a dia</p>

                        {!currentUser ? (
                            <>
                                <button className={styles.button} onClick={() => navigate("/login")}>
                                    <div className={styles.buttonText}>Saber Mais <FaArrowRight /></div>
                                </button>
                            </>
                        ) : (
                            <>
                                <button className={styles.button} onClick={() => navigate("/buscar")}>
                                    <div className={styles.buttonText}>Saber Mais <FaArrowRight /></div>
                                </button>
                            </>
                        )}
                    </div>
                </div>
                <div className={styles.card}>
                    <div className={styles.carditem}>
                    <div className={styles.item}>
                        <div className={styles.circle}>1</div>
                        <div className={styles.texto}>Receitas seguras e <br />nutritivas</div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.circle}>2</div>
                        <div className={styles.texto}>Salve suas <br />receitas favoritas</div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.circle}>3</div>
                        <div className={styles.texto}>Análise inteligente <br />de alimentos</div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Intro;