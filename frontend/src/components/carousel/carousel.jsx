import React from "react";
import { Carousel } from "react-bootstrap";
import style from "./carousel.module.css"; 

const RecipeCarousel = ({ items }) => {
  return (
    <Carousel>
      {items.map((item, index) => (
        <Carousel.Item key={index}>
          <img
            className={`d-block w-100 ${style.carouselImage}`}
            src={item.image}
            alt={item.alt}
          />
          <Carousel.Caption>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default RecipeCarousel;
