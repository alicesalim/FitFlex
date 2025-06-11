import React, { useState } from "react";
import styles from "./solicitar.module.css";

export default function Solicitar() {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    setLoading(true);
    try {
      const resp = await fetch("http://localhost:4567/usuario/recuperar-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await resp.json();
      setMensagem(data.mensagem || data.erro);
    } catch (err) {
      setMensagem("Erro ao enviar solicitação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <h2 className={styles.title}>Recuperar senha</h2>
      <input
        type="email"
        placeholder="Seu e-mail"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className={styles.input}
        disabled={loading}
      />
      <button type="submit" className={styles.button} disabled={loading}>
        {loading ? "Enviando..." : "Enviar link"}
      </button>
      {loading && <div className={styles.loader}></div>}
      {mensagem && <p className={styles.message}>{mensagem}</p>}
    </form>
  );
}