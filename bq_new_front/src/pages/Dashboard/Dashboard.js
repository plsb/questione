import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';

import {
  TotalQuestion,
  TotalStudent,
  TotalProfessor,
  TotalEvaluation,
} from './components';

import NextEvaluations from "./components/NextEvaluations";
import {toast} from "react-toastify";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
  },
  gridStartEvaluation: {
    paddingBottom: theme.spacing(4)
  }
}));

const Dashboard = props => {
  const { history} = props;
  const classes = useStyles();
  const level_user = localStorage.getItem("@Questione-acess-level-user");

  const onClickQuestion = () => {
    if(level_user == 2) {
      history.push('/questions');
    }
  };

  const onClickEvaluations = () => {
    if(level_user == 2) {
      history.push('/evaluations');
    }
  };

  return (
    <div className={classes.root}>
        { level_user == 2 &&
            <Grid
                container
                spacing={2}>
              <Grid
                item
                lg={3}
                sm={6}
                xl={3}
                xs={12}>
                <TotalStudent className="total-student"/>
              </Grid>
              <Grid
                item
                lg={3}
                sm={6}
                xl={3}
                xs={12}>
                <TotalProfessor className="total-professor"/>
              </Grid>
              <Grid item onClick={onClickQuestion}
                    lg={3}
                    sm={6}
                    xl={3}
                    xs={12}>
                <TotalQuestion className="total-question"/>
              </Grid>
              <Grid
                item onClick={onClickEvaluations}
                lg={3}
                sm={6}
                xl={3}
                xs={12}>
                <TotalEvaluation className="total-evaluation"/>
              </Grid>
            </Grid>
        }
        { level_user == 0 ?
            <Grid
                item
                xs={12}>
              <NextEvaluations className="next-evaluations"/>
            </Grid>
            : null
        }
    </div>
  );
};

export default Dashboard;
