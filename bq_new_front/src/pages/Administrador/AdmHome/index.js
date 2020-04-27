import React from 'react';

import './AdmHome-style.css';

const AdmHome = () => {
  return (
    <div className="general-container">
      <div>
        <div class="MuiToolbar-root"></div>

        <div className="menu">
          <div class="vertical-menu">
            <a href="#">Areas de Conhecimento</a>
            <a href="#">Perfis</a>
            <a href="#">Competências</a>
            <a href="#">Objetos de Conhecimento</a>
            <a href="#">Professores</a>
            <a href="#">Validar Questões de Terceiros</a>
          </div>
        </div>

      </div>
      <div className="teste">
        <div class="container">
          <input class="form-control mb-2" id="tableSearch" type="text"
            placeholder="Digite algo para pesquisar itens da lista"></input>

          <table class="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Descrição do Curso</th>
                <th>Sigla</th>
                <th>Área de Conhecimento</th>
              </tr>
            </thead>
            <tbody id="myTable">
              <tr>
                <td>null</td>
                <td>null</td>
                <td>null</td>
              </tr>
              <tr>
                <td>null</td>
                <td>null</td>
                <td>null</td>
              </tr>
              <tr>
                <td>null</td>
                <td>null</td>
                <td>null</td>
              </tr>
              <tr>
                <td>null</td>
                <td>null</td>
                <td>null</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdmHome;
