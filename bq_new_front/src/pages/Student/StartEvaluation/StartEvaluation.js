import React from 'react';
import { makeStyles } from '@material-ui/styles';
import {Grid, IconButton} from '@material-ui/core';

import { StartEvaluationCard } from '../../../components';
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import PropTypes from "prop-types";
import CourseDetails from "../../Administrator/Course/CourseDetails";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  gridStartEvaluation: {
    paddingBottom: theme.spacing(4)
  }
}));

const StartEvaluation = props => {
  const { className, history, ...rest } = props;
  const classes = useStyles();

  const handleBack = () => {
    history.goBack();
  };

  return (
    <div className={classes.root}>
      <div className={classes.contentHeader}>
        <IconButton onClick={handleBack}>
          <ArrowBackIcon />
        </IconButton>
      </div>
      <Grid
          container
          spacing={1}
          className={classes.gridStartEvaluation}>
        <Grid
            item
            xs={12}>
          <StartEvaluationCard />
        </Grid>

      </Grid>
    </div>
  );
};

StartEvaluation.propTypes = {
  className: PropTypes.string,
};

export default StartEvaluation;
