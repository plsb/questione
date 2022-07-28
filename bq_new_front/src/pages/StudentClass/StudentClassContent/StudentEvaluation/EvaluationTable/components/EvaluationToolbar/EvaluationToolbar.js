import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {Typography} from '@material-ui/core';

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
  title: {
    fontWeight: 'bold'
  }
}));

const EvaluationToolbar = props => {
  const { className, onClickSearch, onChangeSearch, searchText, studentClassId, history, ...rest } = props;

  const classes = useStyles();

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}>
      <div className={classes.row}>
        <Typography variant="h3" className={classes.title}>{'Avaliações'}</Typography>
        <span className={classes.spacer} />
      </div>
      <div className={classes.row}>

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
