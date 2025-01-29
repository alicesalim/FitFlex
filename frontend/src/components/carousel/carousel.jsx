
import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import style from '../carousel/carousel.module.css'; 

const Carousel = ({ items }) => {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    arrows: true,
  };

  return (
    <Slider {...settings}>
      {items.map((item, index) => (
        <div key={index}>
          <img
            src={item.image}
            alt={item.alt}
            className={style.carousel_image}
          />
        </div>
      ))}
    </Slider>
  );
};

export default Carousel;


