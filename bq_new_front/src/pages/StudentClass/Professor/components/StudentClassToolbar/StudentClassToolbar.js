import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";
import clsx from 'clsx';
import FindInPage from '@material-ui/icons/SearchSharp';

import { Button, MenuItem, TextField, Typography } from '@material-ui/core';


import useStyles from './styles';

const StudentClassToolbar = props => {
  const { className, onClickSearch, onChangeSearch, searchText, handleStatusCallback, tabValue, history, setStatus, ...rest } = props;

  const [value, setValue] = useState(1);

  const classes = useStyles();

  const handleChange = (event) => {
    handleStatusCallback(1, event.target.value, searchText);
    setValue(event.target.value);
    setStatus(event.target.value);
  };

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}>
      <div className={classes.row}>
        <div style={{ flex: 1 }}>
          <Typography variant="h3" className={classes.title}>{'Turmas'}</Typography>
          
          <span className={classes.spacer} />

          <div className={classes.subtitle}>
            Para mais informações sobre o módulo turmas,&nbsp;
            <a href="https://docs.google.com/document/d/10u_l5bjyYjy-Pii18ya4OzWptxOnAJFfn_lUYmYQ4y4/edit?usp=sharing"
               target="_blank"
               rel="noopener noreferrer">
              clique aqui.
            </a>
          </div>
        </div>
        <div style={{ padding: '16px' }}>
          <Button
            aria-controls="simple-menu"
            aria-haspopup="true"
            color="primary"
            variant="contained"
            onClick={() => history.push('/student-class-details/professor')}
          >
            Nova turma
          </Button>
        </div>
      </div>
      <div className={classes.row}>
        <div className={classes.filters}>
          <TextField
            className={classes.root}
            id="type-of-evaluation"
            select
            label="Status"
            value={value}
            onChange={handleChange}
            helperText="Selecione um status para aplicar o filtro."
            variant="outlined"
            margin="dense"
            style={{ width: '300px' }}>
            <MenuItem value={1}>Ativas</MenuItem>
            <MenuItem value={2}>Arquivadas</MenuItem>
          </TextField>

          <TextField
            label="Buscar"
            helperText="Buscar por descrição"
            margin="dense"
            onChange={onChangeSearch}
            value={searchText}
            style={{ width: '300px', marginLeft: '16px' }}
            variant="outlined"
          />

          <Button
            onClick={onClickSearch}
            className={classes.searchButton}>
            <FindInPage fontSize="large" />
          </Button>
        </div>
      </div>
    </div>
  );
};

StudentClassToolbar.propTypes = {
  className: PropTypes.string,
  onChangeSearch: PropTypes.func,
  onClickSearch: PropTypes.func,
  searchText: PropTypes.string,
  history: PropTypes.object
};

export default withRouter(StudentClassToolbar);
