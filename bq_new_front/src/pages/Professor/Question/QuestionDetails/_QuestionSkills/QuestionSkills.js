import React, { useState } from 'react';
import { TinyMCE } from '../../../../../components';


import {
  TextField,
  Button
} from '@material-ui/core';


const QuestionSkills = props => {

  const [inputFields, setInputFields] = useState([
    { firstName: '', lastName: '' }
  ]);

  const handleAddFields = () => {
    const values = [...inputFields];
    values.push({ firstName: '', lastName: '' });
    setInputFields(values);
  };

  return (
    <div>
      <div className="form-group col-sm-2">
        <button
          className="btn btn-link"
          type="button"
          onClick={() => handleAddFields()}
        >
          Adicionar Objeto 
          </button>
      </div>

      <div style={{ padding: "30px", width: "50vw" }}>
        <br></br>
        <br></br>
        <TextField style={{ width: "76.5vw" }}
          variant="outlined"
          id="filled-select-currency"
          select
          label="Selecione o curso dessa questão:"
          helperText="Resposta errada."
          variant="outlined"
          margin="dense">
        </TextField>
      </div>
      <div style={{ padding: "30px", marginTop: "-50px" }}>
        <br></br>
        <br></br>
        <TextField style={{ width: "76.5vw" }}
          title="Teste"
          id="filled-select-currency"
          select
          label="Selecione o curso para aparecer a competência:"
          helperText="Resposta errada."
          variant="outlined"
          margin="dense">
        </TextField>
      </div>
      <div style={{ padding: "30px", marginTop: "-50px" }}>
        <br></br>
        <br></br>
        <TextField style={{ width: "76.5vw" }}
          title="Teste"
          id="filled-select-currency"
          select
          label="Selecione o curso para aparecer os objetos de conhecimento:"
          helperText="Resposta errada."
          variant="outlined"
          margin="dense">
        </TextField>
      </div>
      <Button style={{ margin: "10px", top: "5px" }} variant="contained" color="primary" href="question-itens">Cadastrar Questão</Button>
    </div>
  );
}

export default QuestionSkills;
