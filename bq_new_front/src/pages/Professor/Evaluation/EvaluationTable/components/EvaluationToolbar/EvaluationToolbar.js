import React, {useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {Button, MenuItem, TextField, Typography} from '@material-ui/core';
import FindInPage from '@material-ui/icons/SearchSharp';

import { SearchInput } from '../../../../../../components';
import {withRouter} from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {},
  row: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '20px'
  },
  spacer: {
    flexGrow: 1
  },
  title: {
    fontWeight: 'bold',
    padding: '16px',
  },
  subtitle: {
    padding: '16px',
    fontSize: '15px',
  },
  filters: {
    position: 'relative',
    padding: '16px',
  },
}));

const EvaluationToolbar = props => {
  const { className, onClickSearch, onChangeSearch, searchText, history, handleStatusCallback, setStatus, ...rest } = props;

  const classes = useStyles();

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
      <div className={classes.row}>
        <div style={{ flex: 1 }}>
          <Typography variant="h3" className={classes.title}>{'Avaliações'}</Typography>
          <span className={classes.spacer} />

          <div className={classes.subtitle}>
            Para mais informações sobre o módulo avaliações,&nbsp;
            <a href="https://docs.google.com/document/d/1FKDHngeXQd5r8CEE8V4EAZFlrM75Nl99vI13zJ3MbTY/edit?usp=sharing"
               target="_blank"
               rel="noopener noreferrer">
              clique aqui.
            </a>
          </div>
        </div>
        <div style={{ padding: '16px' }}>
          <Button
              color="primary"
              variant="contained"
              onClick={onClickNewCourse}>
            Nova Avaliação
          </Button>
        </div>
        {/*<Button className={classes.exportButton}
                onClick={onClickRequestUsers}>Arquivadas</Button>*/}
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
              onClick={onClickSearch}>
            <FindInPage fontSize="large"/>
          </Button>
        </div>
      </div>
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
