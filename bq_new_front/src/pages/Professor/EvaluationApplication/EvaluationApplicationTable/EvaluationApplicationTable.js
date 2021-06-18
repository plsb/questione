import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  Table,
  TableBody,
  TablePagination, CardHeader, Grid, LinearProgress
} from '@material-ui/core';
import api from '../../../../services/api';

import { toast } from 'react-toastify';
import UsersToolbar from "./components/EvaluationApplicationToolbar";
import PropTypes from "prop-types";
import EvaluationApplicationCard from "../EvaluationApplicationCard";

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
    minWidth: '100%'
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

const EvaluationApplicationTable = props => {
  const { className, history } = props;

  const [evaluationsApplications, setEvaluationsApplications] = useState(null);

  const classes = useStyles();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [open, setOpen] = React.useState(false);

  async function loadEvaluationsApplications(page){
    try {
      let url = 'evaluation/list-applications?page='+page;
      if(searchText != ''){
        url += '&description='+searchText;
      }
      const response = await api.get(url);
      if(response.status == 200) {  
        setTotal(response.data.total);
        setEvaluationsApplications(response.data.data);
      } else {
        setEvaluationsApplications([]);
      }
    } catch (error) {

    }
  }

  useEffect(() => {
    loadEvaluationsApplications(1);
  }, []);

  const updateSearch = (e) => {
    setSearchText(e.target.value);
  }

  const onClickSearch = (e) => {
    setPage(0);
    loadEvaluationsApplications(1);
  }

  const handlePageChange = (event, page) => {
    loadEvaluationsApplications(page+1)
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
              {evaluationsApplications == null ?
                  <LinearProgress color="secondary"    />
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
                            {evaluationsApplications.map(application => (
                                <EvaluationApplicationCard application={application} key={application.id} />  
                            ))}
                          </TableBody>
                        </Table>
                      </Grid>
                    </Grid> }
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

EvaluationApplicationTable.propTypes = {
  history: PropTypes.object
};

export default EvaluationApplicationTable;
