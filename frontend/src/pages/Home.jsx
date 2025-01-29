import React from "react";
import { motion } from "framer-motion";
import style from './Home.module.css';
import Button from '../components/button/Button'; // Certifique-se de importar o componente Button
import RecipeCarousel from '../components/carousel/carousel';
import HighlightCard from "../components/card/card";
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';


const Home = () => {
  const recipeItems = [
    {
      image: "/src/assets/images/receita.png",
      alt: "First slide",
      title: "Primeira receita",
      description: "Nulla vitae elit libero, a pharetra augue mollis interdum.",
    },
    {
      image: "/src/assets/images/receita.png",
      alt: "Second slide",
      title: "Segunda receita",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      image: "/src/assets/images/receita.png",
      alt: "Third slide",
      title: "Terceira receita",
      description: "Praesent commodo cursus magna, vel scelerisque nisl consectetur.",
    },
  ];
  const cards = [
    {
      image: "/src/assets/images/d1.png",
      alt: "Card 1",
      title: "Explorando Novos Sabores",
      text: "Descubra novos sabores sem comprometer sua dieta!",
    },
    {
      image: "/src/assets/images/d2.png",
      alt: "Card 2",
      title: "Relação Positiva",
      text: "Cultive uma relação positiva com todos os aspectos relacionados à alimentação.",
    },
    {
      image: "/src/assets/images/d3.png",
      alt: "Card 3",
      title: "No Pain, With Gain!",
      text: "Perda de peso com mais facilidade e menos restrições.",
    },
  ];

  return (
    <motion.div
      className={style.inicial}
      initial={{ opacity: 0 }}
      animate={{ opacity: 2 }}
      transition={{ duration: 1.5 }}
    >
      <div className={style.container}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <h1 className={style.display4}>Bem-vindo ao FitFlex!</h1>
            <p className={style.pagtxt}>
              Acompanhe suas dietas e explore substituições saudáveis para suas receitas favoritas.
            </p>
            <img src="/src/assets/images/paginicial.jpg" className={style.imgFluid} alt="Imagem de destaque" />
          </div>
        </div>
        <Button text="Substituir receita" />
      </div>

      <div className={style.carouselContainer}>
        <h2>Receitas em tendência</h2>
        <RecipeCarousel items={recipeItems} />
      </div>

      <div className={style.carouselContainer}>
        <h2>Destaques</h2>
        <div className="d-flex justify-content-around my-4">
          {cards.map((card, index) => (
            <HighlightCard key={index} {...card} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Home;

