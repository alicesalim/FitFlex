import React from "react";
import style from "../card/card.module.css";
import Button from "../button/button";

function Card({title, text, image }){
    return(
        <div className={style.container}>
            <h1>{title}</h1>
            <div className={style.text_image}>
                <p>{text}</p>
                <div className={style.image}>{image}</div>
            </div>
            <div className={style.botao}>
                <Button />
            </div>
        </div>
    )
}export default Card;