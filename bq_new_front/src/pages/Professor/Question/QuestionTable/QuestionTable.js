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
import {QUESTION_SEARCH_SKILL, searchQuestions, searchQuestionsPage} from "../../../../services/seacrhQuestions";

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

      let QUESTION_SEARCH_TYPE = "";
      if(searchText[0].value == "S"){
        url += '&user=S';
        QUESTION_SEARCH_TYPE = 'S';
      } else {
        url += '&user=T';
        QUESTION_SEARCH_TYPE = 'T';
      }
      let QUESTION_SEARCH_COURSE = 0;
      let QUESTION_SEARCH_SKILL = 0;
      let QUESTION_SEARCH_OBJECT = 0;
      if(searchText[1].fk_course_id > 0){
        url += '&fk_course_id='+searchText[1].fk_course_id;
        QUESTION_SEARCH_COURSE = searchText[1].fk_course_id;

        if(searchText[2].fk_object_id > 0){
          url += '&fk_object_id='+searchText[2].fk_object_id;
          QUESTION_SEARCH_OBJECT = searchText[2].fk_object_id;
        }

        if(searchText[3].fk_skill_id > 0){
          url += '&fk_skill_id='+searchText[3].fk_skill_id;
          QUESTION_SEARCH_SKILL = searchText[3].fk_skill_id;
        }

      }
      let data = {};
      let QUESTION_SEARCH_KEYWORD = "";
      if(searchText[4].keyword != ''){
        const keyword = searchText[4].keyword.split(" ").join("%20");
        url += '&keyword='+keyword;
        QUESTION_SEARCH_KEYWORD = searchText[4].keyword;
      }

      let QUESTION_SEARCH_ID = "";
      if(searchText[5].id != ""){
        url += '&id='+searchText[5].id;
        QUESTION_SEARCH_ID = searchText[5].id;
      }

      const response = await api.get(url);
      if(response.status == 200) {
        searchQuestions(QUESTION_SEARCH_TYPE, QUESTION_SEARCH_ID, QUESTION_SEARCH_COURSE,
            QUESTION_SEARCH_SKILL, QUESTION_SEARCH_OBJECT, QUESTION_SEARCH_KEYWORD);
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
    if(localStorage.getItem('@Questione-search-type') != null){
      searchText[0].value = localStorage.getItem('@Questione-search-type');
    }
    if(localStorage.getItem('@Questione-search-course') != 0){
      searchText[1].fk_course_id = localStorage.getItem('@Questione-search-course');
    }
    if(localStorage.getItem('@Questione-search-object') != 0){
      searchText[2].fk_object_id = localStorage.getItem('@Questione-search-object');
    }
    if(localStorage.getItem('@Questione-search-skill') != 0){
      searchText[3].fk_skill_id = localStorage.getItem('@Questione-search-skill');
    }
    if(localStorage.getItem('@Questione-search-id') != ''){
      searchText[5].id = localStorage.getItem('@Questione-search-id');
    }
    if(localStorage.getItem('@Questione-search-show-keyword') != ''){
      searchText[4].keyword = localStorage.getItem('@Questione-search-show-keyword');
    }
    if(localStorage.getItem('@Questione-search-page') != 0){
      handlePageChange(null,  Number(localStorage.getItem('@Questione-search-page')));

    }

    loadQuestions(page+1);
  }, [refresh]);

  const updateSearch = (e) => {
    setSearchText(e.target.value);
  }

  const onClickSearch = (e) => {
    setPage(0);
    loadQuestions(1);
    searchQuestionsPage(0);
  }

  const onClickCleanSearch = (e) => {
    console.log('chamou');
    searchText[0] = {"value" : "S"};
    searchText[1] = {"fk_course_id" : 0};
    searchText[2] = {"fk_object_id" : 0};
    searchText[3] = {"fk_skill_id" : 0};
    searchText[4] = {"keyword" : ''};
    searchText[5] = {"id" : ''};
    onClickSearch();
  }

  const handlePageChange = (event, newPage) => {
    loadQuestions(newPage+1);
    setPage(newPage);
    searchQuestionsPage(newPage);
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
              onClickCleanSearch={onClickCleanSearch}/>
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
