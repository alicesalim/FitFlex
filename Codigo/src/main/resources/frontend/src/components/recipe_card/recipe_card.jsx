import React from "react";
import styles from "./recipe_card.module.css";

const RecipeCard = () => {
  return (
    <div className={styles.container}>
      {/* Imagem de fundo */}
      <div className={styles.imageContainer}>
      <img src="/assets/panqueca.png" alt="Panqueca de Aveia" className={styles.image} />
        <div className={styles.overlay}>
          <h1 className={styles.title}>Panqueca de Aveia</h1>
          <div className={styles.details}>
            <span>450 Kcal</span>
            <span>45 IG</span>
            <span>30min</span>
          </div>
        </div>
      </div>

      {/* Seção de Ingredientes e Modo de Preparo */}
      <div className={styles.content}>
        <div className={styles.ingredients}>
          <h2>Ingredientes</h2>
          <ul>
            <li>Delícia Supreme 100 g</li>
            <li>Açúcar 160 g</li>
            <li>Ovos 4 un</li>
            <li>Farinha de trigo 165 g</li>
            <li>Amido de milho 50 g</li>
            <li>Leite 200 ml</li>
            <li>Fermento em pó 10 g</li>
            <li>Chocolate granulado 75 g</li>
            <li>Açúcar de confeiteiro (quanto baste)</li>
          </ul>
        </div>

        <div className={styles.preparation}>
          <h2>Modo de preparo</h2>
          <ol>
            <li>Bata a Delícia Supreme com o açúcar até virar um creme leve.</li>
            <li>Adicione os ovos e continue batendo.</li>
            <li>Acrescente a farinha e o amido, intercalando com o leite.</li>
            <li>Adicione o fermento e o chocolate granulado.</li>
            <li>Unte uma forma e despeje a massa.</li>
            <li>Asse em forno preaquecido a 180°C por 35 minutos.</li>
            <li>Desenforme e polvilhe açúcar de confeiteiro.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
