import React, { useState, useEffect, useRef } from 'react';
import styles from './navbar.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUtensils, faBook } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from '../../contexts/AuthContext';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaSearch, FaUser, FaHeart, FaBook, FaSignOutAlt } from "react-icons/fa";
import { AuthContext } from "../../contexts/AuthContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4567";

const Navbar = () => {
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [imagemPerfil, setImagemPerfil] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
   const navRef = useRef(null);
  const hamburguerRef = useRef(null);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const hamburguer = hamburguerRef.current;
    const nav = navRef.current;

    if (hamburguer && nav) {
      const handleClick = () => nav.classList.toggle(styles.active);
      hamburguer.addEventListener("click", handleClick);

      // Cleanup
      return () => {
        hamburguer.removeEventListener("click", handleClick);
      };
    }

    async function fetchUsuario() {
      try {
        setCarregando(true);
        const response = await fetch(`${API_URL}/usuario/${currentUser.id}`);
        if (!response.ok) {
          setErro("Usuário não encontrado.");
          return;
        }
        const data = await response.json();
        setUsuario(data);

        if (data.imagemPerfil) {
          const base64Image = bytesToBase64(data.imagemPerfil);
          setImagemPerfil(`data:image/jpeg;base64,${base64Image}`);
        } else {
          setImagemPerfil(null);
        }
      } catch (error) {
        setErro("Erro ao buscar dados do usuário.");
        console.error(error);
      } finally {
        setCarregando(false);
      }
    }

    fetchUsuario();
  }, [currentUser, navigate]);

  const bytesToBase64 = (bytes) => {
    if (!bytes || !bytes.length) return null;

    try {
      const byteArray = new Uint8Array(bytes);
      let binary = '';
      byteArray.forEach(byte => {
        binary += String.fromCharCode(byte);
      });
      return btoa(binary);
    } catch (e) {
      console.error("Erro ao converter bytes para base64:", e);
      return null;
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.containerLogo}>
        <Link to="/"> <img src="/assets/logo.png" alt="Logo" /> </Link>
      </div>
      <button className={styles.hamburguer}></button>
      <ul className={styles.navLinks}>
        <NavLink
          to="/buscar"
          className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
        >
          Buscar Receitas
        </NavLink>
        <NavLink
          to="/analisar"
          className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
        >
          Análise de Produtos
        </NavLink>

        {isAdmin && (
          <>
            <li>
              <NavLink to="/ingredientes"  className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                <FontAwesomeIcon icon={faUtensils} size="1x" color="#616161" /> Ingredientes
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/receitas"  className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                <FontAwesomeIcon icon={faBook} size="1x" color="#616161" /> Receitas
              </NavLink>
            </li>
          </>
        )}

        {currentUser ? (
          <>
            <li>
              <Link to="/perfil" className={styles.link}>
                <img
                  src={imagemPerfil || "/assets/semfoto.png"}
                  alt="Foto de perfil"
                  className={styles.imagem}
                />
              </Link>
            </li>
          </>
        ) : (
          <li><Link to="/login" className={styles.link}>Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
