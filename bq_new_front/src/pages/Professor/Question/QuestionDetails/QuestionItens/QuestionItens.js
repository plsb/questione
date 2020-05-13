import React from 'react';
import { TinyMCE } from '../../../../../components';


import {
  TextField,
  Button
} from '@material-ui/core';


const QuestionItens = props => {

  

  return (
    <div>
      <div style={{padding: "30px"}}>
        <br></br>
        <b className="item1">ITEM 1</b>
        <TinyMCE />
        <TextField style={{width: "76.5vw"}}
          id="filled-select-currency"
          select
          label="Informe se este é o item correto:"
          helperText="Resposta errada."
          variant="outlined"
          margin="dense">
        </TextField>
      </div>
      <div style={{padding: "30px"}}>
        <b className="item1">ITEM 2</b>
        <TinyMCE />
        <TextField style={{width: "76.5vw"}}
          id="filled-select-currency"
          select
          label="Informe se este é o item correto:"
          helperText="Resposta errada."
          variant="outlined"
          margin="dense">
        </TextField>
      </div>
      <div style={{padding: "30px"}}>
        <b className="item1">ITEM 3</b>
        <TinyMCE />
        <TextField style={{width: "76.5vw"}}
          id="filled-select-currency"
          select
          label="Informe se este é o item correto:"
          helperText="Resposta errada."
          variant="outlined"
          margin="dense">
        </TextField>
      </div>
      <div style={{padding: "30px"}}>
        <b className="item1">ITEM 4</b>
        <TinyMCE />
        <TextField style={{width: "76.5vw"}}
          id="filled-select-currency"
          select
          label="Informe se este é o item correto:"
          helperText="Resposta errada."
          variant="outlined"
          margin="dense">
        </TextField>
      </div>
      <div style={{padding: "30px"}}>
        <b className="item1">ITEM 5</b>
        <TinyMCE />
        <TextField style={{width: "76.5vw"}}
          id="filled-select-currency"
          select
          label="Informe se este é o item correto:"
          helperText="Resposta errada."
          variant="outlined"
          margin="dense">
        </TextField>
      </div>
      <Button style={{ margin: "10px", top: "2px" }} variant="contained" color="primary" href="question-skills">Proximo</Button>
    </div>
  );
}
export default QuestionItens;
