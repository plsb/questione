import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  Table,
  TableBody,
  TablePagination, CardHeader, Grid, LinearProgress,
  Box, Typography,
} from '@material-ui/core';
import api from '../../../../../services/api';
import UsersToolbar from "./components/EvaluationToolbar";
import PropTypes from "prop-types";
import EvaluationCard from "../EvaluationCard";

const useStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  },
  content: {
    padding: 0,
    marginTop: theme.spacing(1)
  },
  inner: {
    minWidth: 1050
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  headTable: {
    fontWeight: "bold"
  },
  actions: {
    justifyContent: 'flex-end'
  },
  row: {
    display: 'flex',
    alignItems: 'center',
  },
  spacer: {
    flexGrow: 1
  },
  importButton: {
    marginRight: theme.spacing(1)
  },
  searchInput: {
    marginRight: theme.spacing(1)
  }
}));

const EvaluationTable = props => {
  const { className } = props;

  const [evaluations, setEvaluations] = useState(null);

  const classes = useStyles();

  const [refresh, setRefresh] = React.useState(0);

  async function loadEvaluations(page) {
    try {
      let url = 'class/student/evaluations/' + props.studentClassId;
      const response = await api.get(url);
      if (response.status == 200) {
        setEvaluations(response.data);
      } else {
        setEvaluations([]);
      }

    } catch (error) {

    }
  }

  useEffect(() => {
    loadEvaluations(1);
  }, [refresh]);

  return (
    <div className={classes.root}>
      <UsersToolbar
        studentClassId={props.studentClassId}
      />
      <div className={classes.content}>
        {evaluations == null ?
          <LinearProgress color="secondary" />
          :
          <Grid
            container
            spacing={1}>
            <Grid
              item
              md={12}
              xs={12}>
              <Table>
                <TableBody>
                  {evaluations.map(evaluation => (
                    <EvaluationCard evaluation={evaluation}
                      setTabValue={() => {}}
                      setRefresh={setRefresh}
                      studentClassId={props.studentClassId}
                      idApplication={evaluation.id_application}
                      refresh={refresh}
                    />
                  ))}
                </TableBody>
              </Table>
            </Grid>
          </Grid>
        }
      </div>
    </div>
  );
};

EvaluationTable.propTypes = {
  history: PropTypes.object
};

export default EvaluationTable;
