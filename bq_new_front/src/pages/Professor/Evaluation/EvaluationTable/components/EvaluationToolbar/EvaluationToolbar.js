import React, {useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {Box, Button, Card, CardContent, MenuItem, TextField, Typography} from '@material-ui/core';
import {withRouter} from "react-router-dom";
import useStyles from "../../../../../../style/style";

const useStylesLocal = makeStyles(theme => ({
  textField: {
    marginLeft: theme.spacing(1),
  },
}));

const EvaluationToolbar = props => {
  const { className, onClickSearch, onChangeSearch, searchText, history, handleStatusCallback, setStatus, ...rest } = props;

  const classes = useStylesLocal();
  const classesGeneral = useStyles();

  const [value, setValue] = useState(1);

  const onClickRequestUsers = () => {
    history.push('/evaluations-archive');
  }

  const onClickNewCourse = e => {
    history.push('/evaluation-details');
  }

  const handleChange = (event) => {
    handleStatusCallback(1, event.target.value, searchText);
    setValue(event.target.value);
    setStatus(event.target.value);
  };

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}>
      <Card >
        <CardContent>
          <Box display="flex">
            <Box display="flex" justifyContent="flex-start">
              <div className={classesGeneral.titleList}>{'Avaliações'}</div>
            </Box>
            <Box display="flex" sx={{ flexGrow: 1 }} justifyContent="flex-end">
              <Button
                  color="primary"
                  variant="contained"
                  onClick={onClickNewCourse}
                  className={classesGeneral.buttons}>
                Nova Avaliação
              </Button>
            </Box>
          </Box>

          {/*<div className={classes.subtitle}>
            Para mais informações sobre o módulo avaliações,&nbsp;
            <a href="https://docs.google.com/document/d/1FKDHngeXQd5r8CEE8V4EAZFlrM75Nl99vI13zJ3MbTY/edit?usp=sharing"
               target="_blank"
               rel="noopener noreferrer">
              clique aqui.
            </a>
          </div>*/}



          <Box display="flex" justifyContent="flex-start" style={{marginTop: '25px'}}>
            <TextField
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
                className={classes.textField}
                helperText="Buscar por descrição"
                margin="dense"
                onChange={onChangeSearch}
                value={searchText}
                style={{ width: '300px' }}
                variant="outlined"
            />
          </Box>
          <Box display="flex" justifyContent="flex-start">

            <Button variant="contained" color="primary" onClick={onClickSearch} className={classesGeneral.buttons}>
              Filtrar avaliações
            </Button>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

EvaluationToolbar.propTypes = {
  className: PropTypes.string,
  onChangeSearch: PropTypes.func,
  onClickSearch: PropTypes.func,
  searchText: PropTypes.string,
  history: PropTypes.object
};

export default withRouter(EvaluationToolbar);
