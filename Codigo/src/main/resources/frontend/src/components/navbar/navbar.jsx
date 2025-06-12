import React, { useState, useEffect, useRef } from 'react';
import styles from './navbar.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUtensils, faBook } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from '../../contexts/AuthContext';
import { NavLink, Link, useNavigate } from 'react-router-dom';

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


  const fecharMenu = () => {
    if (navRef.current) {
      navRef.current.classList.remove(styles.active);
    }
  };

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setUsuario(null);
      setImagemPerfil(null);
      return;
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
    <nav className={styles.navbar} ref={navRef}>
      <div className={styles.containerLogo}>
      <Link to="/" onClick={fecharMenu}> <img src="/assets/logo.png" alt="Logo" /> </Link>
      </div>
      <button className={styles.hamburguer} ref={hamburguerRef} aria-label="Abrir menu"></button>
      <ul className={styles.navLinks}>
        <NavLink
          to="/buscar"
          className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
          onClick={fecharMenu}
        >
          Buscar Receitas
        </NavLink>
        <NavLink
          to="/analisar"
          className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
          onClick={fecharMenu}
        >
          Análise de Produtos
        </NavLink>

        {isAdmin && (
          <>
            <li>
            <NavLink to="/ingredientes" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link} onClick={fecharMenu}>
                <FontAwesomeIcon icon={faUtensils} size="1x" color="#616161" /> Ingredientes
              </NavLink>
            </li>
            <li>
            <NavLink to="/admin/receitas" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link} onClick={fecharMenu}>
                <FontAwesomeIcon icon={faBook} size="1x" color="#616161" /> Receitas
              </NavLink>
            </li>
          </>
        )}

        {currentUser ? (
          <>
            <li>
            <Link to="/perfil" className={styles.link} onClick={fecharMenu}>
                <img
                  src={imagemPerfil || "/assets/semfoto.png"}
                  alt="Foto de perfil"
                  className={styles.imagem}
                />
              </Link>
            </li>
          </>
        ) : (
          <li><Link to="/login" className={styles.link} onClick={fecharMenu}>Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
