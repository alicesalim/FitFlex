import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./redefinir.module.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4567";

export default function Redefinir() {
  const [novaSenha, setNovaSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle");

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
      return;
    }

    if (novaSenha !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    try {
      const resp = await fetch(`${API_URL}/usuario/redefinir-senha`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, novaSenha }),
      });
      const data = await resp.json();
      setMensagem(data.mensagem || data.erro);
      if (data.mensagem) {
        setStatus("sucesso");
      } else {
        setStatus("erro");
      }
    } catch (err) {
      setMensagem("Erro ao redefinir senha.");
      setStatus("erro");
    }
  };

  if (!token) {
    return <p className={styles.message}>Token inválido ou ausente na URL.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <h2 className={styles.title}>Redefinir senha</h2>
      <input
        type="password"
        placeholder="Nova senha"
        value={novaSenha}
        onChange={e => setNovaSenha(e.target.value)}
        required
        className={styles.input}
      />
      <input
        type="password"
        placeholder="Confirmar senha"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        required
        className={styles.input}
      />
      <button type="submit" className={styles.button} disabled={status === "enviando"}>
        {status === "enviando" ? "Redefinindo..." : "Redefinir"}
      </button>
      {mensagem && <p className={styles.message}>{mensagem}</p>}
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}