import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Table,
  TableBody,
  LinearProgress,
  TablePagination, Grid
} from '@material-ui/core';
import api from '../../../../services/api';
import UsersToolbar from "./components/QuestionToolbar";
import PropTypes from "prop-types";
import QuestionCard from "../../../../components/QuestionCard/QuestionCard";
import {QUESTION_SEARCH_SKILL, searchQuestions, searchQuestionsPage} from "../../../../services/seacrhQuestions";
import useStyles from "../../../../style/style";

const QuestionTable = props => {
  const { className, history } = props;

  const [questions, setQuestions] = useState(null);

  const classes = useStyles();

  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState([]);
  const [refresh, setRefresh] = React.useState(0);
  const [page, setPage] = useState(0);

  async function loadQuestions(page){
    try {
      let url = 'question?page='+page;

      let QUESTION_SEARCH_TYPE = "";
      if(searchText[0].value){
        url += '&user='+searchText[0].value;
        QUESTION_SEARCH_TYPE = searchText[0].value;
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
      console.log('response', url);
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
      //toast.error( 'Erro de conexão.');
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
    searchText[0] = {"value" : "T"};
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
          <TablePagination
              component="div"
              count={total}
              onChangePage={handlePageChange}
              onChangeRowsPerPage={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[8]}/>

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
                          <div style={{marginBottom: '20px'}}>
                            <QuestionCard
                                question={question}
                                setRefresh={setRefresh}
                                refresh={refresh}
                                id_course={searchText[1].fk_course_id}/>
                          </div>
                      ))}
                    </TableBody>
                  </Table>
                </Grid>
              </Grid> }
          <TablePagination
              component="div"
              count={total}
              onChangePage={handlePageChange}
              onChangeRowsPerPage={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[8]}/>
        </div>
      </div>
  );
};

QuestionTable.propTypes = {
  history: PropTypes.object
};

export default QuestionTable;
