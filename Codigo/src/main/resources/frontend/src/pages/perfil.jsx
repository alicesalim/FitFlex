import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Profile from "../components/profile/profile";
import TitleEsq from "../components/title_esq/title_esq";
import styles from "../pages/perfil.module.css";
import { getReceitasUsuario } from "../services/favoritarService";
import { useAuth } from "../contexts/AuthContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4567";

const Perfil = () => {
  const { currentUser } = useAuth();

  const [receitasFavoritas, setReceitasFavoritas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavoritas = async () => {
      if (!currentUser) {
        setError("Usuário não autenticado.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const favoritas = await getReceitasUsuario(currentUser.id); // usa currentUser.id
        const receitas = await Promise.all(
          favoritas.map(async (fav) => {
            console.log(favoritas)
            const response = await fetch(`${API_URL}/receita/${fav.receita_id}`);
            if (!response.ok) throw new Error("Erro ao buscar receita.");
            return await response.json();
          })
        );
        setReceitasFavoritas(receitas);
      } catch (err) {
        setError("Erro ao carregar receitas favoritas.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavoritas();
  }, [currentUser]);

  return (
    <div>
      <Profile
        imagem="/assets/perfil.jpeg"
        nome={currentUser?.nome || "Nome"}
        email={currentUser?.email || "Email"}
        senha={currentUser?.senha || "Senha"}
      />

      <div>
        <TitleEsq title="Receitas Favoritas" />
      </div>

      <div className={styles.container}>
        <div className={styles.contentContainer}>
          <div className={styles.resultsContainer}>
            {loading ? (
              <p>Carregando...</p>
            ) : error ? (
              <p>{error}</p>
            ) : receitasFavoritas.length === 0 ? (
              <p>Você ainda não favoritou nenhuma receita.</p>
            ) : (
  <ol className={styles.recipeGrid}>
  {receitasFavoritas.map((receita) => (
    <li key={receita.id} className={styles.recipeCard}>
      <Link to={`/receita/${receita.id}`} className={styles.recipeLink}>
        <div
          className={styles.recipeImageContainer}
          style={{
            backgroundImage: `url('data:image/jpeg;base64,${receita.imagemBase64}')`,
          }}
        >
          <div className={styles.recipeOverlay}>
            <span className={styles.recipeName}>{receita.nome}</span>
          </div>
        </div>
      </Link>
    </li>
  ))}
</ol>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
