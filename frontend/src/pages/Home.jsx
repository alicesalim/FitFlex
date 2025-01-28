import React from "react";
import style from './Home.module.css';
import Button from '../components/button/Button'; // Certifique-se de importar o componente Button

const Home = () => {
    return (
      <div className={style.inicial}>
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
      </div>
    );
};

export default Home;
