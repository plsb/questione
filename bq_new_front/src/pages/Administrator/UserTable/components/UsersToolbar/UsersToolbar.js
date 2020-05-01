import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';
import FindInPage from '@material-ui/icons/SearchSharp';

import { SearchInput } from '../../../../../components';

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
  }
}));

const UsersToolbar = props => {
  const { className, onClickSearch, onChangeSearch, searchText, ...rest } = props;

  const classes = useStyles();

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}>
      <div className={classes.row}>
        <span className={classes.spacer} />
        <Button className={classes.exportButton}>Solicitações dos Professores</Button>
      </div>
      <div className={classes.row}>
        <SearchInput
          className={classes.searchInput}
          placeholder="Pesquisar"
          onChange={onChangeSearch}
          value={searchText}
        />
        <Button
            onClick={onClickSearch}>
          <FindInPage fontSize="large"/>
        </Button>
      </div>
    </div>
  );
};

UsersToolbar.propTypes = {
  className: PropTypes.string,
  onChangeSearch: PropTypes.func,
  onClickSearch: PropTypes.func,
  searchText: PropTypes.string
};

export default UsersToolbar;
