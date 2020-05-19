import React from 'react';
import { makeStyles } from '@material-ui/styles';
import {Grid, IconButton} from '@material-ui/core';

import { StartEvaluationCard } from '../../../components';
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import PropTypes from "prop-types";

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(3),
  },
  startEvaluation: {
    marginTop: theme.spacing(6),
    paddingBottom: theme.spacing(20)
  }
}));

const StartEvaluation = props => {
  const { className, history, ...rest } = props;
  const classes = useStyles();

  const handleBack = () => {
    history.goBack();
  };

  return (
    <div  className={classes.root}>
      <div>
        <IconButton onClick={handleBack}>
          <ArrowBackIcon />
        </IconButton>
      </div>
      <div className={classes.startEvaluation}>
        <StartEvaluationCard colorBox="#ff9800"/>
      </div>
    </div>
  );
};

StartEvaluation.propTypes = {
  className: PropTypes.string,
};

export default StartEvaluation;
