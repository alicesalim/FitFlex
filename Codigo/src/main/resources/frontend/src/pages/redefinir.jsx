import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./redefinir.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4567";

export default function Redefinir() {
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Pega o token da URL
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    setError("");
    setStatus("enviando");

    if (novaSenha.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres");
      setStatus("idle");
      return;
    }

    if (novaSenha !== confirmPassword) {
      setError("As senhas não coincidem");
      setStatus("idle");
      return;
    }

    try {
      const resp = await fetch(`${API_URL}/usuario/redefinir-senha`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, novaSenha }),
      });
      const data = await resp.json();
      
      if (resp.ok && data.mensagem) {
        setMensagem(data.mensagem);
        setStatus("sucesso");
        // Redirecionar para login após 3 segundos
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(data.erro || "Erro ao redefinir senha");
        setStatus("erro");
      }
    } catch (err) {
      setError("Erro ao redefinir senha. Verifique sua conexão.");
      setStatus("erro");
    }
  };

  if (!token) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Redefinir senha</h2>
        <p className={styles.error}>Token inválido ou ausente na URL.</p>
        <button 
          onClick={() => navigate("/login")}
          className={styles.button}
          style={{ marginTop: "20px" }}
        >
          Voltar ao login
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Redefinir senha</h2>
      <p className={styles.subtitle}>Crie uma nova senha para sua conta</p>
      
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <div className={styles.inputWrapper}>
          <label htmlFor="novaSenha" className={styles.label}>Nova senha</label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              id="novaSenha"
              type={showPassword ? "text" : "password"}
              placeholder="Digite sua nova senha"
              value={novaSenha}
              onChange={e => setNovaSenha(e.target.value)}
              required
              className={styles.input}
              style={{ flexGrow: 1 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                marginLeft: "10px",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
                fontSize: "1.1rem",
                color: "#2374b9",
                width: "24px",
                height: "24px",
              }}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              title={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
        </div>
        
        <div className={styles.inputWrapper}>
          <label htmlFor="confirmSenha" className={styles.label}>Confirmar senha</label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              id="confirmSenha"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirme sua nova senha"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              className={styles.input}
              style={{ flexGrow: 1, marginBottom: 0 }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                marginLeft: "10px",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
                fontSize: "1.1rem",
                color: "#2374b9",
                width: "24px",
                height: "24px",
              }}
              aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
              title={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
            </button>
          </div>
        </div>
        
        <button 
          type="submit" 
          className={styles.button} 
          disabled={status === "enviando"}
          style={{ marginTop: "24px" }}
        >
          {status === "enviando" ? "Redefinindo..." : "Redefinir senha"}
        </button>
      </form>
      
      {status === "sucesso" && (
        <div className={styles.successMessage}>
          <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: "8px", color: "#2374b9" }} />
          {mensagem}
        </div>
      )}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}