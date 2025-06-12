import React, { useState } from "react";
import styles from './signup.module.css';
import { Link, useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4567";

const Signup = () => {
  const [nome, setNome] = useState(""); // se seu backend usa username, ok, se não, adapte.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [imagem, setImagem] = useState(null);
  const [imagemPreview, setImagemPreview] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Limite de tamanho da imagem (500KB)
  const MAX_FILE_SIZE = 500 * 1024; 

  const toBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        try {
          // Pegamos apenas a parte base64 após a vírgula
          const base64String = reader.result.split(',')[1];
          resolve(base64String);
        } catch (err) {
          reject(new Error("Erro ao converter imagem para base64"));
        }
      };
      reader.onerror = error => reject(error);
    });

  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Verificar o tamanho do arquivo
      if (file.size > MAX_FILE_SIZE) {
        setError(`A imagem selecionada (${(file.size/1024).toFixed(1)}KB) excede o limite de ${MAX_FILE_SIZE/1024}KB. Por favor, escolha uma imagem menor ou comprima-a antes de enviar.`);
        e.target.value = null; // Limpa o input
        setImagem(null);
        setImagemPreview(null);
        return;
      }
      
      setImagem(file);
      setError("");
      
      // Criar uma prévia da nova imagem
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagemPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (password !== confirmPassword) {
        setError("As senhas não coincidem.");
        setIsLoading(false);
        return;
      }

      let base64Image = null;
      if (imagem) {
        try {
          base64Image = await toBase64(imagem);
        } catch (err) {
          console.error("Erro ao converter imagem:", err);
          setError("Erro ao processar a imagem. Tente outra imagem ou reduza o tamanho.");
          setIsLoading(false);
          return;
        }
      }

      const newUser = {
        nome: nome,
        email: email,
        senha: password,
        imagemBase64: base64Image,
      };

      const response = await fetch(`${API_URL}/usuario`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || "Erro ao cadastrar usuário.");
      }

      setNome("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setImagem(null);
      setImagemPreview(null);

      navigate("/login");
    } catch (err) {
      console.error("Erro no cadastro:", err);
      setError(err.message || "Erro de rede ou servidor. Tente novamente mais tarde.");
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
          <h1>Bem-vindo ao FitFlex!</h1>
          
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.inputfield}>
            <input
              type="text"
              placeholder="Nome de Usuario"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className={styles.inputfield}>
            <input
              type="email"
              placeholder="E-mail"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.inputfield}>
            <input
              type="password"
              placeholder="Senha"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className={styles.inputfield}>
            <input
              type="password"
              placeholder="Confirme sua senha"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className={styles.imageUploadContainer}>
            <label className={styles.imageUploadLabel}>
              Foto de perfil (máx. 500KB)
              <input
                type="file"
                accept="image/*"
                onChange={handleImagemChange}
                className={styles.fileInput}
              />
            </label>
            
            {imagemPreview && (
              <div className={styles.imagePreview}>
                <img src={imagemPreview} alt="Prévia da imagem" />
              </div>
            )}
          </div>
          
          <button 
            type="submit" 
            className={styles.button} 
            disabled={isLoading}
          >
            {isLoading ? "Cadastrando..." : "Cadastrar"}
          </button>
          
          <div className={styles.signuplink}>
            <p>
              Já possui uma conta? <Link to="/login">Entre aqui!</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
