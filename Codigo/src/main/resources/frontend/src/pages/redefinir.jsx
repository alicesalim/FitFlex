import React, { useState } from "react";
import styles from "./redefinir.module.css";

export default function Redefinir() {
  const [novaSenha, setNovaSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  // Pega o token da URL
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    try {
      const resp = await fetch("http://localhost:4567/usuario/redefinir-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, novaSenha }),
      });
      const data = await resp.json();
      setMensagem(data.mensagem || data.erro);
    } catch (err) {
      setMensagem("Erro ao redefinir senha.");
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
      <button type="submit" className={styles.button}>Redefinir</button>
      {mensagem && <p className={styles.message}>{mensagem}</p>}
    </form>
  );
}