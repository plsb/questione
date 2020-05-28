import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Table,
  TableBody,
  LinearProgress,
  TablePagination, Grid, CardHeader
} from '@material-ui/core';
import api from '../../../../services/api';

import Swal from "sweetalert2";
import UsersToolbar from "./components/QuestionToolbar";
import PropTypes from "prop-types";
import QuestionCard from "../../../../components/QuestionCard/QuestionCard";

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

const QuestionTable = props => {
  const { className, history } = props;

  const [questions, setQuestions] = useState(null);

  const classes = useStyles();

  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState([]);
  const [refresh, setRefresh] = React.useState(0);
  const [page, setPage] = useState(0);

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

  async function loadQuestions(page){
    try {
      let url = 'question?page='+page;

      if(searchText[0].value == "S"){
        url += '&user=S';
      } else {
        url += '&user=T';
      }
      if(searchText[1].fk_course_id > 0){
        url += '&fk_course_id='+searchText[1].fk_course_id;

        if(searchText[2].fk_object_id > 0){
          url += '&fk_object_id='+searchText[2].fk_object_id;
        }

        if(searchText[3].fk_skill_id > 0){
          url += '&fk_skill_id='+searchText[3].fk_skill_id;
        }

      }
      let data = {};
      if(searchText[4].keyword != ''){
        const keyword = searchText[4].keyword.split(" ").join("%20");
        url += '&keyword='+keyword;
      }
      const response = await api.get(url);
      if(response.status == 200) {
        setTotal(response.data.total);
        setQuestions(response.data.data);
      } else {
        setQuestions([]);
      }
    } catch (error) {
      //loadAlert('error', 'Erro de conexão.');
    }
  }

  useEffect(() => {
    loadQuestions(page+1);
  }, [refresh]);

  const updateSearch = (e) => {
    setSearchText(e.target.value);
  }

  const onClickSearch = (e) => {
    setPage(0);
    loadQuestions(1);
  }

  const handlePageChange = (event, page) => {
    loadQuestions(page+1)
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
                      rowsPerPageOptions={[8]}/>

                }/>
              <CardContent>
                {questions == null ?
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
                            {questions.map(question => (
                                <QuestionCard
                                    question={question}
                                    setRefresh={setRefresh}
                                    refresh={refresh}/>
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
                  rowsPerPageOptions={[8]}/>
            </CardActions>
          </Card>
        </div>
      </div>
  );
};

QuestionTable.propTypes = {
  history: PropTypes.object
};

export default QuestionTable;
