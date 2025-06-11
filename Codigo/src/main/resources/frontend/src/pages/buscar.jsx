import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import SearchBar from "../components/search_bar/search_bar";
import { getIngredientesReceita, getReceitas } from "../services/receitaService";
import {
  getContagemAvaliacoesReceita,
  getReceitasComLikes,
} from "../services/avaliarService";
import { getIngredientePorId } from "../services/ingredienteService";
import { useAuth } from "../contexts/AuthContext";
import styles from "./buscar.module.css";

const Buscar = () => {
  const [receitas, setReceitas] = useState([]);
  const [filteredReceitas, setFilteredReceitas] = useState([]);
  const [termoBusca, setTermoBusca] = useState("");
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [setContagemAvaliacoes] = useState(0);
  const { currentUser } = useAuth();
  const [receitaTendenciaId, setReceitaTendenciaId] = useState(null);

  // Filtros e modal
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [nomeFiltro, setNomeFiltro] = useState("");
  const [carboNivel, setCarboNivel] = useState(""); // baixo, medio, alto
  const [caloriasNivel, setCaloriasNivel] = useState(""); // baixo, medio, alto
  const [ordemAlfabetica, setOrdemAlfabetica] = useState("");
  const [carboidratosReceitas, setCarboidratosReceitas] = useState({});
  const [caloriasReceitas, setCaloriasReceitas] = useState({});

  // Atualiza contagem avaliações
  const atualizarContagem = async () => {
    try {
      const novaContagem = await getContagemAvaliacoesReceita(id);
      setContagemAvaliacoes(novaContagem);
    } catch (err) {
      console.error("Erro ao atualizar contagem:", err);
    }
  };

  // Carrega lista de receitas e receita em tendência
  useEffect(() => {
    const fetchReceitas = async () => {
      try {
        setLoading(true);
        const data = await getReceitas();
        setReceitas(data);

        // Buscar número de likes para cada receita
        const receitasComLikes = await Promise.all(
          data.map(async (receita) => ({
            ...receita,
            likes: await getContagemAvaliacoesReceita(receita.id),
          }))
        );

        // Encontrar a receita com mais likes
        const maisCurtida = receitasComLikes.reduce(
          (max, receita) =>
            Number(receita.likes || 0) > Number(max.likes || 0)
              ? receita
              : max,
          receitasComLikes[0]
        );

        // Só marca "EM ALTA" se tiver pelo menos 1 like
        if (maisCurtida && Number(maisCurtida.likes) > 0) {
          setReceitaTendenciaId(maisCurtida.id);
        } else {
          setReceitaTendenciaId(null);
        }
      } catch (err) {
        setError("Erro ao carregar receitas");
        setReceitaTendenciaId(null);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReceitas();
  }, []);

  // Calcula carboidratos e calorias totais de cada receita
  useEffect(() => {
    const calcularMacros = async () => {
      const carbCache = {};
      const calCache = {};
      for (const receita of receitas) {
        let totalCarbo = 0;
        let totalCal = 0;
        try {
          const ingredientes = await getIngredientesReceita(receita.id);
          for (const ing of ingredientes) {
            const ingredienteDetalhado = await getIngredientePorId(ing.ingredienteId);
            // Corrigido: multiplica pelo quantidade usada na receita
            totalCarbo += (ingredienteDetalhado.carbo || 0) * (ing.quantidade || 1);
            totalCal += (ingredienteDetalhado.cal || 0) * (ing.quantidade || 1);
          }
        } catch (e) {
          // Se der erro, deixa 0
        }
        carbCache[receita.id] = totalCarbo;
        calCache[receita.id] = totalCal;
      }
      setCarboidratosReceitas(carbCache);
      setCaloriasReceitas(calCache);
    };
    if (receitas.length > 0) calcularMacros();
  }, [receitas]);

  // Filtro de busca e macros
  useEffect(() => {
    let filtradas = receitas;

    // Filtro por nome (campo de busca principal)
    if (termoBusca) {
      filtradas = filtradas.filter((receita) =>
        receita.nome.toLowerCase().includes(termoBusca.toLowerCase())
      );
    }

    // Filtro por nível de carboidratos
    filtradas = filtradas.filter((receita) => {
      const carb = carboidratosReceitas[receita.id] ?? 0;
      if (carboNivel === "baixo" && carb > 15) return false;
      if (carboNivel === "medio" && (carb < 16 || carb > 30)) return false;
      if (carboNivel === "alto" && carb < 31) return false;
      return true;
    });

    // Filtro por nível de calorias
    filtradas = filtradas.filter((receita) => {
      const cal = caloriasReceitas[receita.id] ?? 0;
      if (caloriasNivel === "baixo" && cal > 100) return false;
      if (caloriasNivel === "medio" && (cal < 101 || cal > 200)) return false;
      if (caloriasNivel === "alto" && cal < 201) return false;
      return true;
    });

    // Ordenação alfabética
    if (ordemAlfabetica === "az") {
      filtradas = filtradas.sort((a, b) => a.nome.localeCompare(b.nome));
    } else if (ordemAlfabetica === "za") {
      filtradas = filtradas.sort((a, b) => b.nome.localeCompare(a.nome));
    }
    // Se ordemAlfabetica for "", não faz nada (mantém a ordem original)

    setFilteredReceitas(filtradas);
  }, [
    termoBusca, receitas, carboNivel, caloriasNivel, carboidratosReceitas,
    caloriasReceitas, ordemAlfabetica
  ]);

  return (
    <div className={styles.container}>
      <div className={styles.bgImage}></div>
      <div className={styles.contentContainer}>
        <div className={styles.headerContainer}>
          <div className={styles.headerRow}>
            <h1 className={styles.title}>Buscar Receitas</h1>
            <div className={styles.searchContainer}>
              <SearchBar
                termoBusca={termoBusca}
                setTermoBusca={setTermoBusca}
                onOpenFilter={() => setShowFilterModal(true)}
              />
            </div>
          </div>
        </div>

        {/* Modal de filtros */}
        {showFilterModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h2>Filtros</h2>
              <label>
                Carboidratos:
                <select
                  value={carboNivel}
                  onChange={e => setCarboNivel(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="" className={styles.filterOption}>Todos</option>
                  <option value="baixo" className={styles.filterOption}>Baixo (até 15g)</option>
                  <option value="medio" className={styles.filterOption}>Médio (16g a 30g)</option>
                  <option value="alto" className={styles.filterOption}>Alto (acima de 30g)</option>
                </select>
              </label>
              <label>
                Calorias:
                <select
                  value={caloriasNivel}
                  onChange={e => setCaloriasNivel(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="" className={styles.filterOption}>Todas</option>
                  <option value="baixo" className={styles.filterOption}>Baixo (até 100kcal)</option>
                  <option value="medio" className={styles.filterOption}>Médio (101 a 200kcal)</option>
                  <option value="alto" className={styles.filterOption}>Alto (acima de 200kcal)</option>
                </select>
              </label>
              <label>
                Ordem alfabética:
                <select
                  value={ordemAlfabetica}
                  onChange={e => setOrdemAlfabetica(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="" className={styles.filterOption}>Sem ordenação</option>
                  <option value="az" className={styles.filterOption}>A-Z</option>
                  <option value="za" className={styles.filterOption}>Z-A</option>
                </select>
              </label>
              <div className={styles.modalActions}>
                <button
                  onClick={() => {
                    setCarboNivel("");
                    setCaloriasNivel("");
                    setOrdemAlfabetica("");
                  }}
                  className={styles.closeButton}
                  type="button"
                >
                  Limpar Filtros
                </button>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className={styles.saveButton}
                  type="button"
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lista de receitas */}
        <div className={styles.resultsContainer}>
          {loading ? (
            <div className={styles.loadingContainer}>
              <span className={styles.loadingText}>
                Carregando receitas
                <span className={styles.dot}>.</span>
                <span className={styles.dot}>.</span>
                <span className={styles.dot}>.</span>
              </span>
            </div>
          ) : error ? (
            <div className={styles.errorContainer}>
              <div className={styles.errorText}>{error}</div>
            </div>
          ) : filteredReceitas.length === 0 ? (
            <div className={styles.emptyContainer}>
              <div className={styles.emptyText}>Nenhuma receita encontrada</div>
            </div>
          ) : (
            <div>
              <h2 className={styles.sectionTitle}>Receitas Disponíveis</h2>
              <ol className={styles.recipeList}>
                {filteredReceitas
                  .slice()
                  .sort((a, b) => {
                    if (a.id === receitaTendenciaId) return -1;
                    if (b.id === receitaTendenciaId) return 1;
                    return 0;
                  })
                  .map((receita) => (
                    <li key={receita.id} className={styles.recipeItem}>
                      <Link
                        to={`/receita/${receita.id}`}
                        className={styles.recipeLink}
                      >
                        <span className={styles.recipeName}>
                          {receita.nome}
                          {receita.id === receitaTendenciaId && (
                            <span className={styles.trendingTag}>EM ALTA</span>
                          )}
                        </span>
                      </Link>
                    </li>
                  ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Buscar;
