import React from "react";
import styles from './termosuso.module.css';

const Perfil = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Termos de Uso</h1>

        <p><strong>Última atualização:</strong> 11/06/2025</p>

        <p>Seja bem-vindo(a)! Ao utilizar este projeto, você concorda com os termos descritos abaixo. Leia atentamente antes de prosseguir.</p>

        <h2>1. Objetivo do Projeto</h2>
        <p>O <strong>FitFlex</strong> é um sistema desenvolvido como parte do curso de <strong>Ciência da Computação</strong> da <strong>PUC Minas</strong>, com foco em auxiliar usuários diabéticos na busca, análise e personalização de receitas alimentares. O projeto tem como objetivo promover escolhas alimentares mais saudáveis e acessíveis, oferecendo funcionalidades como busca inteligente de receitas, filtros nutricionais, sugestões personalizadas e ferramentas de apoio para quem busca uma alimentação equilibrada. Todo o desenvolvimento foi realizado com fins acadêmicos, visando o aprendizado prático de tecnologias web, banco de dados e boas práticas de programação.</p>

        <h2>2. Uso Permitido</h2>
        <ul>
          <li>Acessar e utilizar o conteúdo para fins educacionais e informativos.</li>
          <li>Compartilhar o sistema com fins acadêmicos, desde que referencie a autoria.</li>
        </ul>

        <h2>3. Propriedade Intelectual</h2>
        <p>Todo o conteúdo (códigos, textos e dados) é de autoria dos integrantes do projeto e está protegido por leis de direitos autorais.</p>
        <p>É proibida a reprodução total ou parcial para fins comerciais sem autorização prévia.</p>

        <h2>4. Isenção de Responsabilidade</h2>
        <p>O sistema não substitui orientação médica, nutricional ou profissional.</p>

        <h2>5. Coleta e Uso de Dados</h2>
        <p>Este projeto não realiza coleta de dados sensíveis nem armazena informações pessoais permanentemente.</p>
        <p>Qualquer dado solicitado é apenas para fins de demonstração acadêmica.</p>

        <h2>6. Atualizações e Manutenção</h2>
        <p>O projeto pode ser atualizado, suspenso ou descontinuado a qualquer momento, sem aviso prévio.</p>

        <h2>7. Contato</h2>
        <p>Para dúvidas, sugestões ou solicitações, entre em contato com: <strong>redefinir.fitflex@gmail.com</strong></p>

        <p><strong>Ao utilizar este projeto, você declara ter lido, compreendido e aceitado todos os termos acima.</strong></p>
      </div>
    </div>
  );
};

export default Perfil;
