import React from 'react';

import './home-style.css';


const Home = () => {

  return (
    <div className="container">
      <div className="MuiToolbar-root"></div>

      <div className="menu">
        <div class="vertical-menu">
          <a href="#" class="active">Home</a>
          <a href="#">Banco de Questões</a>
          <a href="#">Suas Questões</a>
          <a href="#">Validar Questões</a>
          <a href="#">Suas Avaliações</a>
          <a href="#">Comunicação com o ADM</a>
          <a href="/Curso">Listar Curso</a>
        </div>
      </div>

    </div>
  );
}

export default Home;
