import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {Button, Typography} from '@material-ui/core';
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

const UserRequestCourseToolbar = props => {
  const { className, onClickSearch, onChangeSearch, searchText, history, ...rest } = props;

  const classes = useStyles();

  const onClickNewRequest = () => {
    history.push('/new-request');
  }

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}>
      <div className={classes.row}>
        <Typography variant="h3" className={classes.title}>{'Solicitações de Cursos'}</Typography>
        <span className={classes.spacer} />
        <Button className={classes.exportButton}
                onClick={onClickNewRequest} variant="contained"
                color="primary">Nova Solicitação</Button>
      </div>
      <div className={classes.row}>

      </div>
    </div>
  );
};

UserRequestCourseToolbar.propTypes = {
  className: PropTypes.string,
  history: PropTypes.object
};

export default withRouter(UserRequestCourseToolbar);
