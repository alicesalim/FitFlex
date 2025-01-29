import React from "react";
import Carousel from '../components/carousel/carousel';

const Home = () => {
  const recipeItems = [
    { image: "/images/paginicial.jpg", alt: "Receita 1" },
    { image: "/images/paginicial.jpg", alt: "Receita 2" },
    { image: "/images/paginicial.jpg", alt: "Receita 3" }
  ];

  return (
    <div className="home-container">
      <h1>Início</h1>
      <div className="container">
        <h2>Receitas em Tendência</h2>
        <div className="carousel-container">
          <Carousel items={recipeItems} />
        </div>
      </div>
    </div>
  );
};

export default Home;


