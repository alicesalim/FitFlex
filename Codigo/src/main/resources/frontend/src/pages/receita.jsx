// src/pages/receita.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import RecipeCard from "../components/recipe_card/recipe_card";
import {
  getReceitaPorId,
  getIngredientesReceita,
} from "../services/receitaService";
import {
  getContagemAvaliacoesReceita,
  getReceitasComLikes,
} from "../services/avaliarService";
import { getIngredientePorId } from "../services/ingredienteService";
import styles from "./receita.module.css";
import Favorite from "../components/favorite/favorite";
import Avaliar from "../components/avaliar/avaliar";
import { useAuth } from "../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUtensils, faListOl, faFireAlt, faChartLine, faImage } from "@fortawesome/free-solid-svg-icons";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const Receita = () => {
  const { id } = useParams();
  const [receita, setReceita] = useState(null);
  const [ingredientes, setIngredientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCalorias, setTotalCalorias] = useState(0);
  const [totalIndiceGlicemico, setTotalIndiceGlicemico] = useState(0);
  const [totalCarboidratos, setTotalCarboidratos] = useState(0);
  const { currentUser } = useAuth();
  const [contagemAvaliacoes, setContagemAvaliacoes] = useState(0);
  const [isTendencia, setIsTendencia] = useState(false);
  const navigate = useNavigate();

  // Função para formatar unidades abreviadas para exibição
  const formatarUnidade = (unidade) => {
    const unidadeMap = {
      "Gramas (g)": "g",
      "Mililitros (ml)": "ml",
      "Unidade (un)": "un",
      "Colher de Sopa (cs)": "cs",
      "Colher de Chá (cc)": "cc",
      "Xícara (xc)": "xc",
      "Quilograma (kg)": "kg",
      "Litro (l)": "l",
    };
    return unidadeMap[unidade] || unidade;
  };

  // Função para converter quantidades para unidades padrão (gramas e mililitros)
  const converterQuantidade = (quantidade, unidade) => {
    switch (unidade) {
      case "Quilograma (kg)":
      case "kg":
        return quantidade * 1000; // kg para g
      case "Litro (l)":
      case "l":
        return quantidade * 1000; // litro para ml
      case "Gramas (g)":
      case "g":
      case "Mililitros (ml)":
      case "ml":
      case "Unidade (un)":
      case "un":
      case "Colher de Sopa (cs)":
      case "cs":
      case "Colher de Chá (cc)":
      case "cc":
      case "Xícara (xc)":
      case "xc":
        return quantidade; // mantem a quantidade
      default:
        return quantidade; // se não reconhecer, mantem original
    }
  };

  const atualizarContagem = async () => {
    try {
      const novaContagem = await getContagemAvaliacoesReceita(id);
      setContagemAvaliacoes(novaContagem);
    } catch (err) {
      console.error("Erro ao atualizar contagem:", err);
    }
  };

  useEffect(() => {
    const fetchReceitaData = async () => {
      try {
        setLoading(true);
        if (id) {
          const receitaData = await getReceitaPorId(id);

          // Processar a imagem em Base64 se existir
          if (receitaData.imagemBase64) {
            receitaData.fotoUrl = `data:image/jpeg;base64,${receitaData.imagemBase64}`;
          }

          setReceita(receitaData);

          await atualizarContagem();

          const ingredientesData = await getIngredientesReceita(id);
          const ingredientesComNome = await Promise.all(
            ingredientesData.map(async (item) => {
              const ingredienteDetalhado = await getIngredientePorId(item.ingredienteId);
              return {
                ...item,
                nome: ingredienteDetalhado.nome,
                cal: ingredienteDetalhado.cal,
                unidade: ingredienteDetalhado.unidade,
                indice: ingredienteDetalhado.indice_glicemico,
                carboidratos: ingredienteDetalhado.carbo,
              };
            })
          );

          setIngredientes(ingredientesComNome);

          // Calcula os totais considerando conversão de unidade para padrão
          const calorias = ingredientesComNome.reduce((acc, item) => {
            const quantidadeConvertida = converterQuantidade(item.quantidade, item.unidade);
            // considera cal por 1g ou 1ml
            return acc + (quantidadeConvertida * item.cal);
          }, 0);
          setTotalCalorias(calorias);

          // Cálculo correto do índice glicêmico ponderado
          const igNumerador = ingredientesComNome.reduce((acc, item) => {
            const quantidadeConvertida = converterQuantidade(item.quantidade, item.unidade);
            const carboTotal = quantidadeConvertida * (item.carboidratos || 0);
            return acc + (item.indice * carboTotal);
          }, 0);

          const igDenominador = ingredientesComNome.reduce((acc, item) => {
            const quantidadeConvertida = converterQuantidade(item.quantidade, item.unidade);
            return acc + (quantidadeConvertida * (item.carboidratos || 0));
          }, 0);

          const indiceGlicemicoPonderado = igDenominador > 0 ? igNumerador / igDenominador : 0;
          setTotalIndiceGlicemico(indiceGlicemicoPonderado);

          const carboidratos = ingredientesComNome.reduce((acc, item) => {
            const quantidadeConvertida = converterQuantidade(item.quantidade, item.unidade);
            return acc + (quantidadeConvertida * item.carboidratos);
          }, 0);
          setTotalCarboidratos(carboidratos);

          const receitasComLikes = await Promise.all(
            (await getReceitasComLikes()).map(async (r) => ({
              ...r,
              likes: await getContagemAvaliacoesReceita(r.id)
            }))
          );

          const maisCurtida = receitasComLikes.reduce(
            (max, receita) =>
              Number(receita.likes || 0) > Number(max.likes || 0) ? receita : max,
            receitasComLikes[0]
          );

          setIsTendencia(receitaData.id === maisCurtida.id && Number(maisCurtida.likes) > 0);
        }
      } catch (err) {
        setError("Erro ao carregar dados da receita");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReceitaData();
  }, [id]);

  const classificarIndiceGlicemico = (indice) => {
    if (indice < 55) return { nivel: "Baixo", cor: "#32C15F" };
    if (indice < 70) return { nivel: "Médio", cor: "#33C4C4" };
    return { nivel: "Alto", cor: "#0E4E3C" };
  };

  if (loading) {
    return <div className={styles.loadingMessage}>Carregando receita...</div>;
  }

  if (error) {
    return <div className={styles.errorMessage}>{error}</div>;
  }

  if (!receita && id) {
    return <div className={styles.errorMessage}>Receita não encontrada</div>;
  }

  return (
    <div className={styles.recipeContainer}>
      {receita ? (
        <div className={styles.recipeCard}>
          <div className={styles.recipeHeaderContainer}>
            <div
              className={styles.recipeImageContainer}
              style={receita.fotoUrl ? { backgroundImage: `url(${receita.fotoUrl})` } : {}}
            >
              <div className={styles.recipeImageOverlay}></div>

              <button className={styles.buttonOverImage} onClick={() => navigate("/buscar")}><FaArrowLeft /> Voltar</button>

              {isTendencia && (
                <span className={styles.trendingTagOverImage}>EM ALTA</span>
              )}
              {/* Título e trending tag */}
              <h1 className={styles.recipeTitleOverImage}>
                {receita.nome}
              </h1>

              {/* Ícones de ações */}
              {currentUser && (
                <div className={styles.actionsOverImage}>
                  <Favorite usuarioId={currentUser.id} receitaId={receita.id} />
                  <Avaliar
                    usuarioId={currentUser.id}
                    receitaId={receita.id}
                    onAvaliar={atualizarContagem}
                  />
                  <span style={{ fontWeight: "bold" }}>
                    {contagemAvaliacoes}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.recipeContent}>
            <div>
              <h2 className={styles.sectionTitle}>
                <FontAwesomeIcon icon={faUtensils} className={styles.sectionIcon} />
                Ingredientes
              </h2>
              <ul className={styles.ingredientsList}>
                {ingredientes.map((item, index) => (
                  <li key={index} className={styles.ingredientItem}>
                    <ul className={styles.ingredientItemTitle}>
                      {item.nome} 
                    </ul>
                    <ul className={styles.ingredientItemUnidade}>
                      {item.quantidade}{formatarUnidade(item.unidade)}
                    </ul>
                  </li>
                ))}
              </ul>

              <h2 className={styles.sectionTitle}>
                <FontAwesomeIcon icon={faListOl} className={styles.sectionIcon} />
                Modo de Preparo
              </h2>
              <ol className={styles.preparationList}>
                {receita.modoPreparo &&
                  receita.modoPreparo.split("\n").map((passo, index) =>
                    passo.trim() ? (
                      <li key={index} className={styles.preparationStep}>
                        {passo}
                      </li>
                    ) : null
                  )}
              </ol>
            </div>

            <div className={styles.nutritionInfo}>
              <div className={styles.nutritionItem}>
                <h2 className={styles.sectionTitleV}>Total de Calorias</h2>
                <p className={styles.nutritionValue}>
                  {totalCalorias.toFixed(2)} kcal
                </p>
              </div>

              <div className={styles.nutritionItem}>
                <h2 className={styles.sectionTitleV}>Total de Carboidratos</h2>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <p className={styles.nutritionValue} style={{ margin: 0 }}>
                    {totalCarboidratos.toFixed(2)} g
                  </p>
                </div>
              </div>

              <div className={styles.nutritionItem}>
                <h2 className={styles.sectionTitleV}>
                  <FontAwesomeIcon icon={faChartLine} className={styles.sectionIcon} />
                  Índice Glicêmico
                </h2>
                <div className={styles.glicemicIndex}>
                  <p className={styles.nutritionValue}>
                    {totalIndiceGlicemico.toFixed(2)}
                  </p>
                  <span
                    className={styles.glicemicBadge}
                    style={{
                      backgroundColor:
                        classificarIndiceGlicemico(totalIndiceGlicemico).cor,
                    }}
                  >
                    {classificarIndiceGlicemico(totalIndiceGlicemico).nivel}
                  </span>
                </div>

                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#0E4E3C",
                    opacity: 0.8,
                    marginTop: "0.5rem",
                  }}
                >
                  {totalIndiceGlicemico < 55
                    ? "Ideal para pessoas com diabetes"
                    : totalIndiceGlicemico < 70
                      ? "Consumo moderado para diabéticos"
                      : "Consumo limitado para diabéticos"}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <RecipeCard />
      )}
    </div>
  );
};

export default Receita;
