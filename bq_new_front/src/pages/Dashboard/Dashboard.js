import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';

import {
  TotalQuestion,
  TotalStudent,
  TotalProfessor,
  TotalEvaluation,
} from './components';

import { StartEvaluationCard } from './../../components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  gridStartEvaluation: {
    paddingBottom: theme.spacing(4)
  }
}));

const Dashboard = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid
          container
          spacing={1}
          className={classes.gridStartEvaluation}>
        <Grid
            item
            xs={12}>
          <StartEvaluationCard colorBox="#03a9f4" />
        </Grid>
      </Grid>
      <Grid
        container
        spacing={4}>
        <Grid
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}>
          <TotalQuestion />
        </Grid>
        <Grid
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}>
          <TotalStudent />
        </Grid>
        <Grid
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}>
          <TotalProfessor />
        </Grid>
        <Grid
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}>
          <TotalEvaluation />
        </Grid>
        {/*<Grid
          item
          lg={8}
          md={12}
          xl={9}
          xs={12}>
          <LatestSales />
        </Grid>
        <Grid
          item
          lg={4}
          md={6}
          xl={3}
          xs={12}>
          <UsersByDevice />
        </Grid>
        <Grid
          item
          lg={4}
          md={6}
          xl={3}
          xs={12}>
          <LatestProducts />
        </Grid>
        <Grid
          item
          lg={8}
          md={12}
          xl={9}
          xs={12}
        >
          <LatestOrders />
        </Grid>*/}
      </Grid>
    </div>
  );
};

export default Dashboard;
