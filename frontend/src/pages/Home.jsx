import React from "react"
import Button from '../components/button/button'
import style from './Home.module.css'

function Home (){
    return(
        <div className={style.container}>
            <h1> Bem Vindo ao FitFlex!</h1>
            <p>Acompanhe suas dietas e explore substituições saudáveis para suas receitas favoritas</p>
            <Button text="Substituir" />
        </div>       
    )
} export default Home;