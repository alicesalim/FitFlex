import React, { useEffect, useState } from "react";
import { adicionarReceitaUsuario, removerReceitaUsuario, getReceitasUsuario } from "../../services/avaliarService";
import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa";

const Avaliar = ({ usuarioId, receitaId, onAvaliar }) => {
  const [favoritado, setFavoritado] = useState(false);

  useEffect(() => {
    const verificarFavorito = async () => {
      try {
        const favoritas = await getReceitasUsuario(usuarioId);
        const existe = favoritas.some((item) => item.receita_id === receitaId);
        setFavoritado(existe);
      } catch (error) {
        console.error("Erro ao verificar avaliações:", error);
      }
    };

    if (usuarioId && receitaId) {
      verificarFavorito();
    }
  }, [usuarioId, receitaId]);

  const toggleFavorito = async () => {
  setFavoritado((prev) => !prev);
  try {
    if (favoritado) {
      await removerReceitaUsuario(receitaId, usuarioId);
    } else {
      await adicionarReceitaUsuario(receitaId, usuarioId);
    }
    if (typeof onAvaliar === "function") {
      onAvaliar();
    }
  } catch (error) {
    setFavoritado((prev) => !prev);
    console.error("Erro ao atualizar avaliação:", error);
  }
};

  return (
    <button
      onClick={toggleFavorito}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: "2.5rem",
        color: favoritado ? "white" : "white"
      }}
      aria-label="Avaliar receita"
    >
      {favoritado ? <FaThumbsUp /> : <FaRegThumbsUp />}
    </button>
  );
};

export default Avaliar;
