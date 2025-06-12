import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './login.module.css';
import { Link } from "react-router-dom";
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4567";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const credentials = {
      email: username,
      senha: password,
    };

    try {
      const response = await fetch(`${API_URL}/usuario/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.erro || "Erro ao realizar login.");
        return;
      }

      const user = await response.json();

      if (user && user.id) {
        // Usar o contexto de autenticação para login
        login(user);
        
        // Se for admin, redirecionar para a página de admin
        if (user.email === 'admin@fitflex.com') {
          navigate('/perfil');
        } else {
          navigate('/perfil');
        }
      } else {
        setError("Credenciais inválidas.");
      }
    } catch (err) {
      setError("Erro de rede ou servidor.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.imageContainer}>
        <img src="/assets/login.png" alt="Imagem de Login" />
      </div>
      <div className={styles.container}>
        <form onSubmit={handleSubmit}>
          <h1>Bem-vindo de volta ao FitFlex!</h1>
          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.inputfield}>
            <input
              type="text"
              placeholder="E-mail"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className={styles.inputfield} style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ flexGrow: 1 }}
            />
            <button className={styles.button}
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'relative',
                marginLeft: '10px',
                backgroundColor: 'transparent',
                top: '-10px',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                userSelect: 'none',
                fontSize: '1.1rem',
                color: '#555',
                outline: 'none',
                width: '20px',
                height: '20px',
              }}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              title={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>

          <div className={styles.recallforget}>
            <label>
              <input type="checkbox" />
              Lembre de mim
            </label>
            <a href="/recuperar-senha">Esqueci minha senha</a>
          </div>
          <button type="submit">Entrar</button>
          <div className={styles.signuplink}>
            <p>
              Não possui conta? <Link to="/signup">Cadastre-se aqui!</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
