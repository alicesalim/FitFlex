import React from "react";
import { motion } from "framer-motion";
import style from './Home.module.css';
import Button from '../components/button/Button'; // Certifique-se de importar o componente Button
import Carousel from 'react-bootstrap/Carousel';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
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
          <Carousel>
            <Carousel.Item>
              <img
                className={`d-block w-100 ${style.carouselImage}`}
                src="/src/assets/images/receita.png"
                alt="First slide"
              />
              <Carousel.Caption>
                <h3>Primeira receita</h3>
                <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className={`d-block w-100 ${style.carouselImage}`}
                src="/src/assets/images/receita.png"
                alt="Second slide"
              />
              <Carousel.Caption>
                <h3>Segunda receita</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className={`d-block w-100 ${style.carouselImage}`}
                src="/src/assets/images/receita.png"
                alt="Third slide"
              />
              <Carousel.Caption>
                <h3>Terceira receita</h3>
                <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </div>
        <div className={style.carouselContainer}>
          <h2>Destaques</h2>
          <div className="d-flex justify-content-around my-4">
            <Card style={{ width: '25rem' }} className="mx-2">
              <Card.Img variant="top" src="/src/assets/images/d1.png" alt="Card 1" />
              <Card.Body>
                <Card.Title>Explorando Novos Sabores</Card.Title>
                <Card.Text>Descubra novos sabores sem comprometer sua dieta!</Card.Text>
              </Card.Body>
            </Card>
            <Card style={{ width: '25rem' }} className="mx-2">
              <Card.Img variant="top" src="/src/assets/images/d2.png" alt="Card 2" />
              <Card.Body>
                <Card.Title>Relação Positiva</Card.Title>
                <Card.Text>Cultive uma relação positiva com todos os aspectos relacionados à alimentação.</Card.Text>
              </Card.Body>
            </Card>
            <Card style={{ width: '25rem' }} className="mx-2">
              <Card.Img variant="top" src="/src/assets/images/d3.png" alt="Card 3" />
              <Card.Body>
                <Card.Title>No Pain, With Gain!</Card.Title>
                <Card.Text>Perda de peso com mais facilidade e menos restrições.</Card.Text>
              </Card.Body>
            </Card>
          </div>
        </div>
      </motion.div>
    );
};

export default Home;
