import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination, Tooltip, Button, CardHeader, Grid
} from '@material-ui/core';
import api from '../../../../services/api';

import Swal from "sweetalert2";
import UsersToolbar from "./components/EvaluationToolbar";
import PropTypes from "prop-types";
import EvaluationCard from "../EvaluationCard";
const useStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  content: {
    padding: 0,
    marginTop: theme.spacing(2)
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

const EvaluationArchiveTable = props => {
  const { className, history } = props;

  const [evaluations, setEvaluations] = useState([]);

  const classes = useStyles();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [open, setOpen] = React.useState(false);
  const [refresh, setRefresh] = React.useState(0);

  //configuration alert
  const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });

  function loadAlert(icon, message) {
    Toast.fire({
      icon: icon,
      title: message
    });
  }

  async function loadEvaluations(page){
    try {
      let url = 'evaluation?status=2&page='+page;
      if(searchText != ''){
        url += '&description='+searchText;
      }
      const response = await api.get(url);
      setTotal(response.data.total);
      setEvaluations(response.data.data);
    } catch (error) {
      loadAlert('error', 'Erro de conexão.');
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
    loadEvaluations(page+1)
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
            onClickSearch={onClickSearch}/>
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

                }/>
            <CardContent>
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
                                          setRefresh={setRefresh}
                                          refresh={refresh}/>
                      ))}
                    </TableBody>
                  </Table>
                </Grid>
              </Grid>
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

EvaluationArchiveTable.propTypes = {
  history: PropTypes.object
};

export default EvaluationArchiveTable;
