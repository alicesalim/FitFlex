import React from "react"
import style from "./button.module.css";

function Button({ text }){
    return(
        <button className={style.button}>
            {text}
        </button>
    );
    
}export default Button;