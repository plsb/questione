import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";
import clsx from 'clsx';
import FindInPage from '@material-ui/icons/SearchSharp';

import { Button, MenuItem, TextField, Typography } from '@material-ui/core';


import useStyles from './styles';

const StudentClassToolbar = props => {
  const { className, onClickSearch, onChangeSearch, searchText, handleStatusCallback, tabValue, history, setShowRegisterDialog, ...rest } = props;

  const classes = useStyles();

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <div className={classes.row}>
        <div style={{ flex: 1 }}>
          <Typography variant="h3" className={classes.title}>{'Minhas turmas'}</Typography>
          <span className={classes.spacer} />
        </div>
        <div style={{ padding: '16px' }}>
          <Button
            aria-controls="simple-menu"
            aria-haspopup="true"
            color="primary"
            variant="contained"
            onClick={() => {
              setShowRegisterDialog(true);
            }}
            style={{ marginRight: '12px' }}
          >
            Participar de uma turma
          </Button>
        </div>
      </div>
      <div className={classes.row}>
        <div className={classes.filters}>
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
            className={classes.searchButton}
          >
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
