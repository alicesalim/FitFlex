import React from "react";
import styles from "./search_bar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
const SearchBar = ({ termoBusca, setTermoBusca, onOpenFilter }) => {
  const handleChange = (e) => setTermoBusca(e.target.value);
  const handleClear = () => setTermoBusca('');

  return (
<div className={styles.searchBar}>
  <div className={styles.inputWrapper}>
  <svg
      xmlns="http://www.w3.org/2000/svg"
      className={styles.searchIcon}
      fill="none"
      viewBox="0 0 24 24"
      stroke="#616161"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
    <input
      type="text"
      placeholder="Buscar receitas saudáveis"
      value={termoBusca}
      onChange={handleChange}
      className={styles.searchInput}
    />

    {termoBusca && (
    
    <button
      className={styles.clearButton}
      onClick={handleClear}
      aria-label="Limpar busca"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className={styles.clearIcon}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  )}
  </div>


  
  <button
    className={styles.filterButton}
    onClick={onOpenFilter}
    aria-label="Abrir filtros"
    type="button"
  >
    <FontAwesomeIcon icon={faFilter} />
    Filtrar
  </button>
</div>
  );
};

export default SearchBar;