import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {Button, TextField, Typography} from '@material-ui/core';
import FindInPage from '@material-ui/icons/SearchSharp';

import { SearchInput } from '../../../../../../components';
import {withRouter} from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {},
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1)
  },
  spacer: {
    flexGrow: 1
  },
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  },
  searchInput: {
    marginRight: theme.spacing(1)
  },
  comboboxSearch: {
    width: '40%'
  },
  title: {
    fontWeight: 'bold'
  }
}));

const RequestUsersToolbar = props => {
  const { className, onClickSearch, onChangeSearch, searchText, history, ...rest } = props;

  const classes = useStyles();

  const onCLickUsers = () => {
    history.push('/users');
  }

  const situations = [
    {
      value: '0',
      label: 'Aguardando'
    },
    {
      value: '1',
      label: 'Aceitos'
    },
    {
      value: '-1',
      label: 'Recusados'
    }
  ];

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}>
      <div className={classes.row}>
        <Typography variant="h3" className={classes.title}>{'Lista de Solicitações dos Usuários'}</Typography>
        <span className={classes.spacer} />
        <Button className={classes.exportButton}
            onClick={onCLickUsers}>Lista de Usuários</Button>
      </div>
      <div className={classes.row}>
        <div className={classes.comboboxSearch}>
          <TextField
              fullWidth
              label="Situação"
              margin="dense"
              name="valid"
              onChange={onChangeSearch}
              select
              // eslint-disable-next-line react/jsx-sort-props
              SelectProps={{ native: true }}
              value={searchText}
              variant="outlined">
            {situations.map(situation => (
                <option
                    key={situation.value}
                    value={situation.value}>
                  {situation.label}
                </option>
            ))}
          </TextField>
        </div>
        {/*<SearchInput
          className={classes.searchInput}
          placeholder="Pesquisar"
          onChange={onChangeSearch}
          value={searchText}
        />*/}
        <Button
            onClick={onClickSearch}>
          <FindInPage fontSize="large"/>
        </Button>
      </div>
    </div>
  );
};

RequestUsersToolbar.propTypes = {
  className: PropTypes.string,
  onChangeSearch: PropTypes.func,
  onClickSearch: PropTypes.func,
  searchText: PropTypes.string,
  history: PropTypes.object
};

export default withRouter(RequestUsersToolbar);
