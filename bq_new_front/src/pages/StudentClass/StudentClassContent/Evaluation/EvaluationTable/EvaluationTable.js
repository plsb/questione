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

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [refresh, setRefresh] = React.useState(0);

  async function loadEvaluations(page) {
    try {
      let url = 'class/evaluation?&page=' + page + '&fk_class_id=' + props.studentClassId;
      if (searchText != '') {
        url += '&description=' + searchText;
      }
      const response = await api.get(url);
      if (response.status == 200) {
        setTotal(response.data.total);
        setEvaluations(response.data.data);
      } else {
        setEvaluations([]);
      }

    } catch (error) {

    }
  }

  useEffect(() => {
    loadEvaluations(1);
  }, [refresh]);

  const updateSearch = (e) => {
    setSearchText(e.target.value);
  }

  const onClickSearch = (e) => {
    setPage(0);
    loadEvaluations(1);
  }

  const handlePageChange = (event, page) => {
    loadEvaluations(page + 1)
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  return (
    <div className={classes.root}>
      <UsersToolbar
        onChangeSearch={updateSearch.bind(this)}
        searchText={searchText}
        onClickSearch={onClickSearch}
        studentClassId={props.studentClassId}
      />
      <div className={classes.content}>
        <Card
          className={clsx(classes.root, className)}>
          <CardHeader
            avatar={
              <div>

              </div>
            }
            action={
              <TablePagination
                component="div"
                count={total}
                onChangePage={handlePageChange}
                onChangeRowsPerPage={handleRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[10]}
              />

            } />
          <CardContent>
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
                          refresh={refresh}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </Grid>
              </Grid>}
          </CardContent>
          <CardActions className={classes.actions}>
            <TablePagination
              component="div"
              count={total}
              onChangePage={handlePageChange}
              onChangeRowsPerPage={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[10]}
            />
          </CardActions>
        </Card>
      </div>
    </div>
  );
};

EvaluationTable.propTypes = {
  history: PropTypes.object
};

export default EvaluationTable;
