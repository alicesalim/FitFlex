import React, { useEffect, useState } from "react";
import { adicionarReceitaUsuario, removerReceitaUsuario, getReceitasUsuario } from "../../services/favoritarService";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

const Favorite = ({ usuarioId, receitaId }) => {
  const [favoritado, setFavoritado] = useState(false);

  useEffect(() => {
    const verificarFavorito = async () => {
      try {
        const favoritas = await getReceitasUsuario(usuarioId);
        const existe = favoritas.some((item) => item.receita_id === receitaId);
        setFavoritado(existe);
      } catch (error) {
        console.error("Erro ao verificar favoritos:", error);
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
  } catch (error) {
    setFavoritado((prev) => !prev);
    console.error("Erro ao atualizar favorito:", error);
  }
};

  return (
    <button 
      onClick={toggleFavorito}
      style={{ 
        background: "none", 
        border: "none", 
        cursor: "pointer", 
        fontSize: "2.4rem", 
        color: favoritado ? "white" : "white" 
      }}
      aria-label="Favoritar receita"
    >
      {favoritado ? <FaBookmark/> : <FaRegBookmark />}
    </button>
  );
};

export default Favorite;
